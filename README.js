// https://apaas.feishuapp.cn/ae/api-doc/namespaces/package_copysa30x__c/doc-shares/Mwnb3zlL8om/token-getToken?lane_id=master

import httpService from '../utils/services/httpService';
import Taro from '@tarojs/taro';
import apiConfig from '../utils/services/apiConfig';

/**
 * 获取房间任务列表
 * @param {String} siteId
 * @param {Array} filter
 * @param {Number} offset
 * @returns
 */
export const getRoomTaskList = (siteId, filter, offset = 0) => {
  const queryList = [
    {
      leftValue: '_isDeleted',
      operator: 'eq',
      rightValue: false
    },
    {
      leftValue: 'site_id._id',
      operator: 'eq',
      rightValue: siteId
    },
    {
      leftValue: 'cycle_time', //计划未被删除
      operator: 'neq',
      rightValue: null
    },
    {
      leftValue: 'sla_continues_inspect', //继续巡检
      operator: 'eq',
      rightValue: true
    }
  ];
  queryList.push(...filter);

  const data = {
    fields: [
      '_id',
      'site_id',
      'floor',
      'room_type',
      'room',
      'startDate',
      'endDate',
      'floornumber',
      'option_emeakit',
      'referenceField_y8sqynx',
      'number_days_remaining_executable',
      'referenceField_showusing',
      'planObject',
      'plan_timezone',
      'cycle_time',
      'taskResult',
      'user',
      'inspection_room',
      'plan_end_date'
    ],
    filter: [
      {
        and: queryList
      }
    ],
    sort: [
      {
        field: 'option_emeakit',
        direction: 'desc'
      },
      {
        field: 'floornumber',
        direction: 'asc'
      },
      // {
      //   field: 'meetingNumber',
      //   direction: 'asc'
      // },
      {
        field: 'inspection_room',
        direction: 'asc'
      }
    ],
    limit: parseInt(process.env.TARO_APP_LIMIT),
    offset: offset
  };
  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/object_ihdrccm/records`,
    { data }
  );
};

/**
 * 创建巡检设备层面记录
 * @param {Object} batchCreateObject //
 * @param {String} planId //
 * @param {String} overDate //
 */
export const uploadItemTaskResult = (batchCreateObject, planId, overDate) => {
  const data = {
    params: {
      token: Taro.getStorageSync('TOKEN'),
      url: 'https://ae-openapi.feishu.cn/api/data/v1/namespaces/package_copysa30x__c/objects/record_list/batchCreate',
      patchdata: batchCreateObject,
      planid: planId,
      overdate: overDate
    }
  };
  return httpService.post(
    `/api/cloudfunction/v1/namespaces/package_copysa30x__c/invoke/uploadItemTaskResult`,
    { data }
  );
};
/**
 * 批量更新任务列表
 * @param {Object} batchUpdateTaskObject
 * @returns
 */
export const batchUpdateTask = (batchUpdateTaskObject) => {
  const data = {
    params: {
      token: Taro.getStorageSync('TOKEN'),
      url: 'https://ae-openapi.feishu.cn/api/data/v1/namespaces/package_copysa30x__c/objects/task_list/batchUpdate',
      patchdata: batchUpdateTaskObject
    }
  };
  return httpService.post(
    `/api/cloudfunction/v1/namespaces/package_copysa30x__c/invoke/patchupdate`,
    { data }
  );
};
/**
 * 批量更新设备任务历史记录
 * @param {Object} batchUpdateTaskObject
 * @returns
 */
export const batchUpdateTaskHistoryRecords = (batchUpdateTaskObject) => {
  const data = {
    params: {
      token: Taro.getStorageSync('TOKEN'),
      url: 'https://ae-openapi.feishu.cn/api/data/v1/namespaces/package_copysa30x__c/objects/record_list/batchUpdate',
      patchdata: batchUpdateTaskObject
    }
  };
  return httpService.post(
    `/api/cloudfunction/v1/namespaces/package_copysa30x__c/invoke/patchupdate`,
    { data }
  );
};

/**
 * 更新房间巡检结果
 * @param {*} roomTaskId
 * @param {*} roomTaskResult
 * @param {*} roomFileIdList
 * @param {*} userId
 * @param {*} notNeedText
 * @param {*} notNeedPatrol
 * @returns
 */
export const updateRoomTaskResult = (
  roomTaskId,
  roomTaskResult,
  roomFileIdList,
  userNewId,
  notNeedText,
  notNeedPatrol
) => {
  const data = {
    params: {
      token: Taro.getStorageSync('TOKEN'),
      url:
        'https://ae-openapi.feishu.cn/api/data/v1/namespaces/package_copysa30x__c/objects/object_ihdrccm/' +
        roomTaskId,
      patchdata: {
        taskResult: {
          apiName: roomTaskResult
        },
        taskState: {
          apiName: 'done'
        },
        user: {
          _id: parseInt(userNewId)
        },
        taskPhoto: roomFileIdList,
        notneedText: notNeedText,
        datetime_afsqnsu: parseInt(new Date().getTime()),
        timeZoneInformation:
          0 - parseInt(new Date().getTimezoneOffset()) / 60 > 0
            ? `UTC+${0 - parseInt(new Date().getTimezoneOffset()) / 60}`
            : `UTC${0 - parseInt(new Date().getTimezoneOffset()) / 60}`,
        notNeedPatrol: notNeedPatrol
      }
    }
  };
  return httpService.post(
    `/api/cloudfunction/v1/namespaces/package_copysa30x__c/invoke/patchupdate`,
    { data }
  );
};

/**
 * 更新房间巡检历史
 * @param {*} roomTaskId
 * @param {*} roomTaskResult
 * @param {*} roomFileIdList
 * @param {*} notNeedText
 * @param {*} notNeedPatrol
 * @returns
 */
export const updateRoomTaskHistory = (
  roomTaskId,
  roomTaskResult,
  roomFileIdList,
  notNeedText,
  notNeedPatrol
) => {
  const data = {
    params: {
      token: Taro.getStorageSync('TOKEN'),
      url:
        'https://ae-openapi.feishu.cn/api/data/v1/namespaces/package_copysa30x__c/objects/object_ihdrccm/' +
        roomTaskId,
      patchdata: {
        taskResult: {
          apiName: roomTaskResult
        },
        notneedText: notNeedText,
        taskPhoto: roomFileIdList,
        notNeedPatrol: notNeedPatrol
      }
    }
  };
  return httpService.post(
    `/api/cloudfunction/v1/namespaces/package_copysa30x__c/invoke/patchupdate`,
    { data }
  );
};

/**
 * 获取设备任务列表
 */
export const getTaskList = (params) => {
  let isOccupied = params?.isOccupied;
  const and = [
    {
      leftValue: 'plan_list_id',
      operator: 'eq',
      rightValue: params.planId
    },
    {
      leftValue: 'site_id._id',
      operator: 'eq',
      rightValue: params.siteId
    },
    {
      leftValue: 'item_id.lookup_0py8fla._id',
      operator: 'eq',
      rightValue: `${params.floorId}`
    },
    {
      leftValue: 'item_id.lookup_at96fh8._id',
      operator: 'eq',
      rightValue: `${params.roomId}`
    },
    {
      leftValue: 'item_id.option_j8wwovx', //设备启用
      operator: 'eq',
      rightValue: 'option_iuacks9'
    },
    {
      or: [
        {
          leftValue: 'delete_status', //任务未被删除
          operator: 'eq',
          rightValue: 'option_using'
        },
        {
          leftValue: 'delete_status', //任务未被删除
          operator: 'eq',
          rightValue: null
        }
      ]
    }
  ];
  // 普通任务才加上这俩限制条件, 补巡检不用加
  if (!isOccupied) {
    and.push({
      leftValue: 'plan_list_id.option_iqefg30', // 进行中任务
      operator: 'eq',
      rightValue: 'option_yy6r7c0'
    });
    and.push({
      leftValue: 'complete_status', // 未完成的任务
      operator: 'eq',
      rightValue: 'undone'
    });
  }
  const data = {
    fields: [
      '_id',
      'is_error_desc_info',
      'contentDesc',
      'delete_status',
      'isShowNothaveitem',
      'referenceField_ghe7oxh',
      'taskState',
      'isPhoto',
      'room_type',
      'item_id',
      'isMustPhoto',
      'isUseAlbum',
      'isShowErrorNotResolve',
      'isShowErrorResolve',
      'isShowErrorType',
      'site_id',
      'roomInfo',
      'plan_list_id',
      'deviceType',
      'referenceField_hf4dmgc',
      'referenceField_ghe7oxh',
      'referenceField_khku11h',
      'referenceField_cxyom0w',
      'region',
      'item_type',
      'sortNumber',
      'referenceField_jfjimls',
      'option_1xe2tou',
      'text_l4qsi3k',
      'contentName',
      'referenceField_pw4kfh1'
    ],
    filter: [
      {
        and: and
      }
    ],
    sort: [
      {
        direction: 'desc',
        field: 'sortNumber'
      }
    ],
    limit: 200,
    offset: 0
  };
  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/task_list/records`,
    { data }
  );
};

/**
 * 获取设备任务列表
 */
export const getRoomMriDeviceList = (params) => {
      var data = JSON.stringify({
        "page_size": 500,
        "need_total_count": false,
        "query_deleted_record": false,
        "use_page_token": false,
        "offset": 0,
        "select": [
          "_id",
          "device_name", // 名称
          "manufacturer", // 品牌
          "model", // 型号
          "serial", // 序列号
          "asset_number", // 资产编号
          "lookup_item"
        ],
        "order_by": [
          {
            "field": "_id",
            "direction": "desc"
          }
        ],
        "filter": {
          "conditions": [
            {
              "left": {
                "type": "metadataVariable",
                "settings": "{\"fieldPath\":[{\"fieldApiName\": \"room\",\"objectApiName\": \"object_meetingroom_device_info\"}]}"
              },
              "right": {
                "type": "constant",
                "settings": JSON.stringify({ "data": { _id: params.roomId } })
              },
              "operator": "equals"
            },
            {
              "left": {
                "type": "metadataVariable",
                "settings": "{\"fieldPath\":[{\"fieldApiName\": \"status\",\"objectApiName\": \"object_meetingroom_device_info\"}]}"
              },
              "right": {
                "type": "constant",
                "settings": JSON.stringify({ "data": true })
              },
              "operator": "equals"
            }
          ],
          "expression": "1 and 2"
        },
      });
  return httpService.post(
    `/v1/data/namespaces/package_copysa30x__c/objects/object_meetingroom_device_info/records_query`,
    { data }
  );
};

/**
 * @deprecated
 * 获取占用房间设备任务列表
 */
export const getOccupiedRoomTaskList = (params) => {
  const data = {
    fields: [
      '_id',
      'is_error_desc_info',
      'contentDesc',
      'delete_status',
      'isShowNothaveitem',
      'referenceField_ghe7oxh',
      'taskState',
      'isPhoto',
      'room_type',
      'item_id',
      'isMustPhoto',
      'isUseAlbum',
      'isShowErrorNotResolve',
      'isShowErrorResolve',
      'isShowErrorType',
      'site_id',
      'roomInfo',
      'plan_list_id',
      'deviceType',
      'referenceField_hf4dmgc',
      'referenceField_ghe7oxh',
      'referenceField_khku11h',
      'referenceField_cxyom0w',
      'region',
      'item_type',
      'sortNumber',
      'referenceField_jfjimls',
      'option_1xe2tou',
      'text_l4qsi3k',
      'contentName',
      'referenceField_pw4kfh1'
    ],
    filter: [
      {
        and: [
          {
            leftValue: 'plan_list_id',
            operator: 'eq',
            rightValue: params.planId
          },
          {
            leftValue: 'plan_list_id.option_iqefg30', // 进行中任务
            operator: 'eq',
            rightValue: 'option_yy6r7c0'
          },
          {
            leftValue: 'site_id._id',
            operator: 'eq',
            rightValue: params.siteId
          },
          {
            leftValue: 'item_id.lookup_0py8fla._id',
            operator: 'eq',
            rightValue: `${params.floorId}`
          },
          {
            leftValue: 'item_id.lookup_at96fh8._id',
            operator: 'eq',
            rightValue: `${params.roomId}`
          },
          {
            leftValue: 'item_id.option_j8wwovx', //设备启用
            operator: 'eq',
            rightValue: 'option_iuacks9'
          },
          {
            or: [
              {
                leftValue: 'delete_status', //任务未被删除
                operator: 'eq',
                rightValue: 'option_using'
              },
              {
                leftValue: 'delete_status', //任务未被删除
                operator: 'eq',
                rightValue: null
              }
            ]
          }
        ]
      }
    ],
    sort: [
      {
        direction: 'desc',
        field: 'sortNumber'
      }
    ],
    limit: 200,
    offset: 0
  };
  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/task_list/records`,
    { data }
  );
};

/**
 * 获取巡检记录列表
 * @param {String} roomTaskId
 * @returns
 */
export const getHistoryTaskList = (roomTaskId) => {
  const data = {
    fields: [
      '_id',
      'isShowNothaveitem',
      '_createdAt',
      'item_id',
      'roomresult',
      'isPhoto',
      'isMustPhoto',
      'isUseAlbum',
      'isShowErrorResolve',
      'item_type',
      'taskPhoto',
      'option_n78g80c',
      'referenceField_dfmgbl4',
      'errorSub',
      'serviceList',
      'referenceField_dc259wd',
      'richText_4ynjot5',
      'referenceField_dc259wd',
      'isShowErrorType'
    ], //option_n78g80c为巡检结果 referenceField_dfmgbl4巡检类型 referenceField_dc259wd设施类型 richText_4ynjot5巡检异常描述(富文本) referenceField_dc259wd 设施类型
    filter: [
      {
        and: [
          {
            leftValue: 'roomresult._id', // 进行中任务
            operator: 'eq',
            rightValue: roomTaskId
          }
        ]
      }
    ],
    limit: 20,
    offset: 0
  };
  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/record_list/records`,
    { data }
  );
};
/**
 * 获取故障类型
 * @param {*} deviceType
 * @returns
 */
export const getFaultTypeList = (deviceType) => {
  const data = {
    fields: [
      '_id',
      'errorType',
      'errorDetails',
      'multilingual_1wfba75',
      'errorDecribeMulti',
      'display'
    ],
    filter: [
      {
        and: [
          {
            leftValue: 'deviceType',
            operator: 'eq',
            rightValue: deviceType
          }
        ]
      }
    ],
    sort: [
      {
        direction: 'desc',
        field: '_createdAt'
      }
    ],
    limit: 50,
    offset: 0
  };
  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/object_0hvul78/records`,
    { data }
  );
};
/**
 * 上传文件
 * @param {*} filePath
 */
export const uploadTaskFile = async (filePath) => {
  console.log(filePath);
  console.log(filePath.split('/')[3]);
  return Taro.uploadFile({
    url: `${apiConfig.baseUrl}/api/attachment/v1/files`, //仅为示例，非真实的接口地址
    filePath: filePath,
    name: 'file',
    header: {
      Authorization: Taro.getStorageSync('TOKEN')
    }
  });
};

/**
 * 获取无需巡检项列表
 * @param {String} roomType
 * @returns
 */
export const getNoNeedPatrolList = (roomType) => {
  const data = {
    // _id 、 无需巡检名称 、 是否展示无需巡检描述 、 备注是否必填
    fields: ['_id', 'noNeedPatrolName', 'showNoNeedPatrolComment', 'isCommentRequired'],
    filter: [
      {
        and: [
          {
            leftValue: 'roomTypeObject',
            operator: 'eq',
            rightValue: roomType
          }
        ]
      }
    ]
  };
  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/object_8c7g90v/records`,
    { data }
  );
};

// export const getFileInfo = (fileId) => {
//   const data = {};
//   return httpService.get(
//     `/api/attachment/v1/files/${String(fileId)}`,
//     { data }
//   );
// };

export const getFileInfo = (fileId) => {
  return Taro.request({
    url: `https://ae-openapi.feishu.cn/api/attachment/v1/files/${String(fileId)}`,
    method: 'GET',
    responseType: 'arraybuffer',
    header: {
      Authorization: Taro.getStorageSync('TOKEN')
    }
  });
};
/**
 * 获取房间对象信息
 */
export const getRoomObjectByOmmId = (ommId, siteId) => {
  let newOmmId = '-1';
  if (ommId) {
    newOmmId = ommId;
  }
  const data = {
    fields: ['_id'],
    filter: [
      {
        and: [
          {
            leftValue: 'roomid',
            operator: 'eq',
            rightValue: newOmmId
          },
          {
            leftValue: 'lookup_kv79yvp',
            operator: 'eq',
            rightValue: siteId
          }
        ]
      }
    ]
  };

  return httpService.post(
    `/api/data/v1/namespaces/package_copysa30x__c/objects/object_jslamqj/records`,
    { data }
  );
};

/**
 * 获取当前站点的巡检量
 * @param {String} siteId //站点ID
 * @param {Number} site_timezone //时区
 * @returns
 */
export const getInspectionVolumCurrentSite = (siteId, site_timezone) => {
  const data = {
    params: {
      site_id: siteId,
      site_timezone: site_timezone
    }
  };

  return httpService.post(
    `/api/cloudfunction/v1/namespaces/package_copysa30x__c/invoke/inspection_volum_statistics_current_site`,
    { data }
  );
};
