{item.mriList.length > 0 && (
  <View style={{ backgroundColor: '#fff', width: '100%' }}>
    {/* 第一行：表头 */}
    <View style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', height: 30 }}>
      <View style={{ width: '32%', justifyContent: 'center', paddingLeft: 3 }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>设备名称</Text>
      </View>
      <View style={{ width: '34%', justifyContent: 'center', paddingLeft: 3 }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>SN</Text>
      </View>
      <View style={{ width: '34%', justifyContent: 'center', paddingLeft: 3 }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>资产编号</Text>
      </View>
    </View>

    {/* 数据行 */}
    {item.mriList.map((device, index) => (
      <View key={index} style={{ width: '100%', display: 'flex', flexDirection: 'row', borderBottom: '1px solid #f0f0f0', height: 30 }}>
        {/* 设备名称 */}
        <View style={{ width: '32%', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{
              fontSize: 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
            title={device.device_name || '-'}
          >
            {device.device_name || '-'}
          </Text>
        </View>

        {/* SN */}
        <View style={{ width: '34%', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{
              fontSize: 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
            title={device.serial || '-'}
          >
            {device.serial || '-'}
          </Text>
        </View>

        {/* 资产编号 */}
        <View style={{ width: '34%', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{
              fontSize: 10,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'block',
            }}
            title={device.asset_number || '-'}
          >
            {device.asset_number || '-'}
          </Text>
        </View>
      </View>
    ))}
  </View>
)}
