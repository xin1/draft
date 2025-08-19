async function mdmExchangeRate(context, logger, source_currency, language, currency_zh_name, currency_en_name, total, symbolValue, target_currency) {
  const timezone = 'Asia/Shanghai';
  const startTime = moment.tz(moment(), timezone);

  // 首先判断环境类型，确定 lastUpdateTime 的值
  let lastUpdateTime;
  if ([3, 4].includes(context?.app?.type)) { 
      // 生产环境（3 或 4）：使用当天日期（假设 startTime 是当前时间对象）
      lastUpdateTime = startTime.format('YYYY-MM-DD');
  } else {
      // 非生产环境：固定为 2025-05-20
      lastUpdateTime = '2025-05-20';
  }
  
  logger.log('mdmExchangeRate.lastUpdateTime:',lastUpdateTime)
  let exchange_rate = 1
  let exchange_rate_x = `1 ${source_currency} = ${exchange_rate} ${target_currency}`
  let exchange_rate_y = `1 ${target_currency} = ${exchange_rate} ${source_currency}`
  let amount = total  
  let exchange_rate_xy = `${total} ${source_currency} = ${amount} ${target_currency}`

  if (source_currency !== 'USD' || target_currency !== 'USD') {
    const exchange_rate_row = await context.db.object('object_oamd_main_today_exchange_rate')
        .select('xToY', 'updateTime')
        .where({
          //这里似乎代码写错了，如果采用startTime，那么上面lastupdatetime的更新就没意义了
          //'changeDate': `${lastUpdateTime.format('YYYY-MM-DD')} 00:00:00`,
          'changeDate': `${lastUpdateTime} 00:00:00`,
          'xCurreny': source_currency,
          'yCurreny': target_currency
        })
        .findOne()
    logger.log(`${startTime.format('YYYY-MM-DD')} 00:00:00`)
    
    if (!exchange_rate_row) return
    console.log('exchange_rate_row===>', exchange_rate_row)
    exchange_rate = exchange_rate_row['xToY']
    exchange_rate_x = `1 ${source_currency} = ${exchange_rate} ${target_currency}`
    amount = (total * exchange_rate).toFixed(5)
    exchange_rate_xy = `${total} ${source_currency} = ${amount} ${target_currency}`
    lastUpdateTime = exchange_rate_row['updateTime']
  }

  logger.info("exchange_rate",exchange_rate)
  logger.info("exchange_rate_x",exchange_rate_x)
  logger.info("exchange_rate_xy",exchange_rate_xy)

  if (source_currency !== 'USD' || target_currency !== 'USD') {
    const exchange_rate_row2 = await context.db.object('object_oamd_main_today_exchange_rate')
        .select('xToY')
        .where({
          //'changeDate': `${startTime.format('YYYY-MM-DD')} 00:00:00`,
          'changeDate': `${lastUpdateTime} 00:00:00`,
          'xCurreny': target_currency,
          'yCurreny': source_currency,
        })
        .findOne()

    if (exchange_rate_row2) {
      exchange_rate_y = `1 ${target_currency} = ${exchange_rate_row2['xToY']} ${source_currency}`
    }
  }

  logger.info("exchange_rate_y:",exchange_rate_y)

  let noticeDiv = `<div style="display:flex;align-items:center"><div>The data comes from "master data management platform", ${currency_en_name} to US Dollars — ${lastUpdateTime} , The above conversion results are for reference only. Please confirm and fill in the "Cost Impact of Vendor Supply (USD)" Input below.</div></div>`
  if (language === 'zh_CN') {
    noticeDiv = `<div style="display:flex;align-items:center;margin-top:8px"><div>数据来源于主数据平台，${currency_zh_name} 兑换为 美元 — 最近更新时间：${lastUpdateTime.replace('Last update', '')} , 以上换算结果仅供参考</div></div>`
  }
  const richText = `<div style="display:grid;align-items:center;background:rgb(225, 234, 255);border-radius:6px;padding-left:4px">${noticeDiv}<div style="margin-top:6px;margin-bottom:8px">${exchange_rate_xy}</div><div style="margin-bottom:8px">${exchange_rate_x}</div><div style="display:flex;justify-content:space-between;padding-right:16px"><div style="margin-bottom:8px">${exchange_rate_y}</div></div></div>`//<div>${lastUpdateTime}</div>
  logger.info(richText)
  const showTotal = exchange_rate_xy
  return { value: parseFloat(amount) * symbolValue, rate: parseFloat(exchange_rate.toFixed(5)), sourceSingle: exchange_rate_x, targetSingle: exchange_rate_y, showTotal, richText: { raw: richText } }

}
