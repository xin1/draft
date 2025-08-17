{item.mriList.length > 0 && (
  <View style={{ backgroundColor: '#fff', width: '100%' }}>
    {/* 表头 */}
    <View style={{ flexDirection: 'row', borderBottom: '1px solid #f0f0f0', height: 30 }}>
      <View style={{ width: '32%', justifyContent: 'center', paddingLeft: 3 }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>设备名称</Text>
      </View>
      <View style={{ width: '30%', justifyContent: 'center', paddingLeft: 3 }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>SN</Text>
      </View>
      <View style={{ width: '30%', justifyContent: 'center', paddingLeft: 3 }}>
        <Text style={{ fontSize: 11, textAlign: 'center' }}>资产编号</Text>
      </View>
    </View>

    {/* 数据行 */}
    {item.mriList.map((device, index) => (
      <View key={index} style={{ flexDirection: 'row', borderBottom: '1px solid #f0f0f0', height: 30 }}>
        <View style={{ width: '32%', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{ fontSize: 10, paddingHorizontal: 4 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {device.device_name || '-'}
          </Text>
        </View>
        <View style={{ width: '30%', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{ fontSize: 10, paddingHorizontal: 4 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {device.serial || '-'}
          </Text>
        </View>
        <View style={{ width: '30%', justifyContent: 'center', paddingLeft: 3 }}>
          <Text
            style={{ fontSize: 10, paddingHorizontal: 4 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {device.asset_number || '-'}
          </Text>
        </View>
      </View>
    ))}
  </View>
)}
