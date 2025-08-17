{item.mriList.length > 0 && (
  <View style={{ backgroundColor: '#fff', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
    {/* 表头 */}
    <View style={{ width: '32%', height: 30, border: '1px solid #f0f0f0', justifyContent: 'center', paddingLeft: 3 }}>
      <Text style={{ fontSize: 11, textAlign: 'center' }}>设备名称</Text>
    </View>
    <View style={{ width: '34%', height: 30, border: '1px solid #f0f0f0', justifyContent: 'center', paddingLeft: 3 }}>
      <Text style={{ fontSize: 11, textAlign: 'center' }}>SN</Text>
    </View>
    <View style={{ width: '34%', height: 30, border: '1px solid #f0f0f0', justifyContent: 'center', paddingLeft: 3 }}>
      <Text style={{ fontSize: 11, textAlign: 'center' }}>资产编号</Text>
    </View>

    {/* 数据行 */}
    {item.mriList.map((device, index) => (
      <React.Fragment key={index}>
        {/* 设备名称 */}
        <View style={{ width: '32%', height: 30, border: '1px solid #f0f0f0', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{ fontSize: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Taro.showModal({ title: '设备名称', content: device.device_name || '-', showCancel: false })}
          >
            {device.device_name || '-'}
          </Text>
        </View>
        {/* SN */}
        <View style={{ width: '34%', height: 30, border: '1px solid #f0f0f0', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{ fontSize: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Taro.showModal({ title: 'SN', content: device.serial || '-', showCancel: false })}
          >
            {device.serial || '-'}
          </Text>
        </View>
        {/* 资产编号 */}
        <View style={{ width: '34%', height: 30, border: '1px solid #f0f0f0', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{ fontSize: 10 }}
            numberOfLines={1}
            ellipsizeMode="tail"
            onPress={() => Taro.showModal({ title: '资产编号', content: device.asset_number || '-', showCancel: false })}
          >
            {device.asset_number || '-'}
          </Text>
        </View>
      </React.Fragment>
    ))}
  </View>
)}
