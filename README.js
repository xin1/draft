{item.mriList.length > 0 && (
  <View style={{ backgroundColor: '#fff', width: '100%' }}>
    {/* 表头 */}
    <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
      <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#f0f0f0' }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>设备名称</Text>
      </View>
      <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: '#f0f0f0' }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>SN</Text>
      </View>
      <View style={{ flex: 1, height: 30, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>资产编号</Text>
      </View>
    </View>

    {/* 数据行 */}
    {item.mriList.map((device, index) => (
      <View key={index} style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}>
        <View style={{ flex: 1, height: 30, justifyContent: 'center', paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: '#f0f0f0' }}>
          <Text style={{ fontSize: 10 }} numberOfLines={1} ellipsizeMode='tail'>
            {device.device_name || '-'}
          </Text>
        </View>
        <View style={{ flex: 1, height: 30, justifyContent: 'center', paddingHorizontal: 4, borderRightWidth: 1, borderRightColor: '#f0f0f0' }}>
          <Text style={{ fontSize: 10 }} numberOfLines={1} ellipsizeMode='tail'>
            {device.serial || '-'}
          </Text>
        </View>
        <View style={{ flex: 1, height: 30, justifyContent: 'center', paddingHorizontal: 4 }}>
          <Text style={{ fontSize: 10 }} numberOfLines={1} ellipsizeMode='tail'>
            {device.asset_number || '-'}
          </Text>
        </View>
      </View>
    ))}
  </View>
)}
