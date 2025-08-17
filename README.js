// 通过 NPM dependencies 成功安装 NPM 包后此处可引入使用
// 如安装 linq 包后就可以引入并使用这个包
// const linq = require("linq");
const { getMriToken, searchEntities } = require('../mri/api');
/**
 * @param {Params}  params     自定义参数
 * @param {Context} context    上下文参数，可通过此参数下钻获取上下文变量信息等
 * @param {Logger}  logger     日志记录器
 *
 * @return 函数的返回数据
 */
module.exports = async function (params, context, logger) {
  // 日志功能
  // logger.info(`${new Date()} 函数开始执行`);
  const token = await getMriToken(context)
  console.log('token===>', token);
  // const room_id = 'omm_3772de712fbda39379df7a6b28ebfa15'
  const data = {
    entity_type: 1,
    // property_keys: ['device_name', 'asset_number', 'manufacturer', 'model', 'serial'],
    "sort_by": [
      {
        "field": "serial.keyword",
        "descending": true
      }
    ]
  }
  const roomMap = {}
  await context.db.object("object_jslamqj").select('_id', 'roomid', 'lookup_kv79yvp', 'lookup_n90axhc', 'lookup_m834etw', 'region', 'city').where({
    state: 'use',
    roomid: kunlun.operator.notEmpty()
  }).findStream((records) => {
    records.forEach(record => {
      roomMap[record.roomid] = record
    })
  })
  const itemMapping = []
  const deviceItemMapping = {}
  const nameMapping = {}
  await context.db.object("object_mri_device_mapping_item").select('name_cn', 'name_en', 'lookup_items').findStream((records) => {
    records.forEach(record => {
      if (record.lookup_items && Array.isArray(record.lookup_items) && record.lookup_items.length > 0) {
        deviceItemMapping[record.name_cn] = record.lookup_items.map(it => it._id || it.id)
        deviceItemMapping[record.name_en] = record.lookup_items.map(it => it._id || it.id)
        nameMapping[record.name_cn] = record.name.en
        nameMapping[record.name_en] = record.name.cn    

      }
    })
  })
  logger.info('deviceItemMapping===>', deviceItemMapping)
  await context.db.object("facility_type").select('_id', 'room_type_id').findStream((records) => {
    records.forEach(record => {
      itemMapping.push({
        room_type_id: record.room_type_id,
        item_id: record._id
      })
    })
  })
  logger.info('itemMapping===>', itemMapping)

  logger.info('roomMap===>', roomMap)
  const deviceMap = {}
  await context.db.object("object_meetingroom_device_info").select('_id', 'mri_id').findStream((records) => {
    records.forEach(record => {
      deviceMap[record.mri_id] = record
    })
  })
  let haveMore = true
  let page = 0
  const page_size = 500
  const totalInfo = await searchEntities(token, context, logger, data, page_size, page, true)
  const total = totalInfo.data?.pagination?.total
  logger.info('total===>', total)
  while (haveMore) {
    const deviceList = []

    try {
      const result = await kunlun.tool.retry(
        async () => {
          return await searchEntities(token, context, logger, data, page_size, page, false)
        },
        {
          retryCount: 3,
          retryDelay: 1000
        }
      );
      logger.info('page===>', page);
      logger.info('page_size===>', page_size);
      page += 1

      // const pagination = result.data.pagination
      // const total = pagination.total
      if (page * page_size >= total) {
        haveMore = false
      }
      if (!result.data) {
        logger.info('数据获取失败===>', page)
        continue
      }
      const entities = result.data.entities

      // haveMore = false
      entities.forEach(element => {
        if (element?.location_data?.meeting_room_lark_id) {
          deviceList.push(element)
        }
      })
      logger.info('deviceList===>', deviceList.length)

      const updateList = [];
      const createList = [];
      for (let i = 0; i < deviceList.length; i++) {
        const device = deviceList[i]
        const deviceInfo = deviceMap[device.id]
        const roomInfo = roomMap[device.location_data.meeting_room_lark_id]
        if (!roomInfo) {
          continue
        }
        const property_list = device.property_list
        const device_name = property_list?.find(item => item.property_key === 'device_name')?.value;
        const asset_number = property_list?.find(item => item.property_key === 'asset_number')?.value;
        const manufacturer = property_list?.find(item => item.property_key === 'manufacturer')?.value;
        const model = property_list?.find(item => item.property_key === 'model')?.value;
        const serial = property_list?.find(item => item.property_key === 'serial')?.value;
        const mri_id = device.id
        const roomtype = roomInfo.lookup_m834etw?._id || roomInfo.lookup_m834etw?.id
        const deviceMapping = deviceItemMapping[device_name]
        let lookup_item
        if (deviceMapping && roomtype) {
          lookup_item = itemMapping.find(it => it.room_type_id == roomtype && deviceMapping.includes(it.item_id))
        }
        // const lookup_item = itemMapping.find(it => it.room_type_id == roomtype && deviceMapping.includes(it.item_id))
        const item = {
          asset_number: asset_number,
          device_name: device_name,
          manufacturer: manufacturer,
          model: model,
          serial: serial,
          mri_id: JSON.stringify(mri_id),
          business_region: roomInfo.region ? {
            _id: roomInfo.region?._id || roomInfo.region?.id
          } : null,
          city: roomInfo.city ? {
            _id: roomInfo.city?._id || roomInfo.city?.id
          } : null,
          site: roomInfo.lookup_kv79yvp ? {
            _id: roomInfo.lookup_kv79yvp?._id || roomInfo.lookup_kv79yvp?.id
          } : null,
          floor: roomInfo.lookup_n90axhc ? {
            _id: roomInfo.lookup_n90axhc?._id || roomInfo.lookup_n90axhc?.id
          } : null,
          room: roomInfo._id ? {
            _id: roomInfo._id
          } : null,
          source: 'mri',
          status: device.asset_status == 1 ? true : false,
          room_type: roomInfo.lookup_m834etw ? {
            _id: roomtype
          } : null,
          lookup_item: lookup_item ? {
            _id: lookup_item.item_id
          } : null,
        }
        if (deviceInfo) {
          updateList.push({
            _id: deviceInfo._id,
            ...item
          })
        } else {
          createList.push(item)
        }
      }
      logger.info('updateList===>', updateList)
      logger.info('updateList===>', updateList.length)
      logger.info('createList===>', createList)
      logger.info('createList===>', createList.length)
      const batchSize = 200;

      try {
        if (updateList.length > 0) {
          // 将更新列表按200条一批分割处理
          for (let i = 0; i < updateList.length; i += batchSize) {
            const batch = updateList.slice(i, i + batchSize);
            await context.db.object("object_meetingroom_device_info").batchUpdate(batch);
          }
        }
        if (createList.length > 0) {
          // 将创建列表按200条一批分割处理
          for (let i = 0; i < createList.length; i += batchSize) {
            const batch = createList.slice(i, i + batchSize);
            await context.db.object("object_meetingroom_device_info").batchCreate(batch);
          }
        }
      } catch (error) {
        logger.error('MRI设备信息同步失败===>', error)
      }
    } catch (error) {
      logger.error('error===>', error)
      page += 1
      if (page * page_size >= total) {
        haveMore = false
      }
    }
    // 休眠2s
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // 在这里补充业务代码
}
