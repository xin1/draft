{item.mriList.length > 0 && (
  <View style={{ backgroundColor: '#fff', width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
    {/* 第一行：表头 */}
    <View style={{ width: '32%', height: 30, justifyContent: 'center', paddingLeft: 3 }}>
      <Text style={{ fontSize: 11, textAlign: 'center' }}>设备名称</Text>
    </View>
    <View style={{ width: '30%', height: 30, justifyContent: 'center', paddingLeft: 3 }}>
      <Text style={{ fontSize: 11, textAlign: 'center' }}>SN</Text>
    </View>
    <View style={{ width: '30%', height: 30, justifyContent: 'center', paddingLeft: 3 }}>
      <Text style={{ fontSize: 11, textAlign: 'center' }}>资产编号</Text>
    </View>

    {/* 数据行：for循环 */}
    {item.mriList.map((device, index) => (
      <React.Fragment key={index}>
        <View style={{ width: '32%', height: 30, justifyContent: 'center', paddingLeft: 3 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text
              style={{ fontSize: 10, paddingHorizontal: 4 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {device.device_name || '-'}
            </Text>
          </ScrollView>
        </View>
        <View style={{ width: '30%', height: 30, justifyContent: 'center', paddingLeft: 3 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text
              style={{ fontSize: 10, paddingHorizontal: 4 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {device.serial || '-'}
            </Text>
          </ScrollView>
        </View>
        <View style={{ width: '30%', height: 30, justifyContent: 'center', paddingLeft: 3 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <Text
              style={{ fontSize: 10, paddingHorizontal: 4 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {device.asset_number || '-'}
            </Text>
          </ScrollView>
        </View>
      </React.Fragment>
    ))}
  </View>
)}
