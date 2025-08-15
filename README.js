import { View, Text, Alert, TouchableOpacity } from 'react-native';

{item.mriList.length > 0 && (
  <View
    style={{
      backgroundColor: '#fff',
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap'
    }}
  >
    {/* 表头 */}
    {['设备名称', 'SN', '资产编号'].map((header, idx) => (
      <View
        key={idx}
        style={{
          width: '32%',
          height: 30,
          borderWidth: 1,
          borderColor: '#f0f0f0',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ fontSize: 10, fontWeight: 'bold', textAlign: 'center' }}>
          {header}
        </Text>
      </View>
    ))}

    {/* 数据行 */}
    {item.mriList.map((device, index) => (
      <React.Fragment key={index}>
        {['device_name', 'serial', 'asset_number'].map((key, i) => (
          <TouchableOpacity
            key={i}
            style={{
              width: '32%',
              height: 30,
              borderWidth: 1,
              borderColor: '#f0f0f0',
              justifyContent: 'center',
              paddingHorizontal: 4
            }}
            onPress={() => Alert.alert('完整内容', device[key] || '-')}
          >
            <Text
              style={{ fontSize: 9 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {device[key] || '-'}
            </Text>
          </TouchableOpacity>
        ))}
      </React.Fragment>
    ))}
  </View>
)}
