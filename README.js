import {
  GETROOMTASKLIST,
  GETROOMTASKHISTORYLIST,
  GETTASKLIST,
  GETTASKHISTORYLIST,
  UPDATETASKLISTISSUBMITSTATUS,
  SETFAUTYPELTLIST
} from '../constants/task';
import {
  getTaskList,
  getRoomMriDeviceList,
  getRoomTaskList,
  getFaultTypeList,
  uploadItemTaskResult,
  batchUpdateTaskHistoryRecords,
  batchUpdateTask,
  updateRoomTaskResult,
  getHistoryTaskList,
  updateRoomTaskHistory,
  getFileInfo, getOccupiedRoomTaskList
} from '../api/task';
import Taro from '@tarojs/taro';
import i18n from '../pages/i18n';

/**
 * 提交巡检设备层面记录
 * @param {Array} taskList //任务列表
 * @param {String} type //按钮类型:roomUse、notNeed、start
 *  @param {String} roomTaskId
 *  @param {Object} userInfo
 */
export const submitTask = (taskList, type, roomTaskId, userInfo, noNeedParams = null, callback) => {
  const { userId, userNewId } = userInfo;
  // 设备层任务创建参数
  let batchCreateObject = {
    records: []
  };
  // 房间层任务创建参数
  let batchUpdateTaskObject = {
    records: []
  };
  let roomTaskResult = 'normal';
  let roomFileIdList = [];
  for (let index = 0; index < taskList.length; index++) {
    const t = taskList[index];
    let taskData = {
      task_id: {
        _id: t._id
      },
      item_id: {
        _id: t.item_id._id
      },
      option_n78g80c: {
        apiName: t.result
      },
      actual_inspector: {
        _id: parseInt(userNewId)
      },
      option_cooh79w: {
        apiName: 'option_d0bI0cu' //任务已经完成 状态变更为已完成
      },
      data_source: {
        apiName: 'option_54b9lm0'
      },
      roomresult: {
        _id: parseInt(roomTaskId)
      },
      item_type: {
        _id: t.item_type._id
      },
      deviceTypeObject: {
        _id: t.item_type._id
      },
      siteInfoObject: {
        _id: t.site_id._id
      },
      region: {
        _id: t.region._id
      }
    };
    if (type === 'roomUse') {
      roomTaskResult = 'roomuse';
      taskData['taskPhoto'] = [];
      taskData['option_n78g80c'] = {
        apiName: 'roomuse'
      };
    } else if (type === 'noNeed') {
      roomTaskResult = 'notneed';
      taskData['taskPhoto'] = [];
      taskData['option_n78g80c'] = {
        apiName: 'notneed'
      };
    } else {
      taskData.taskPhoto = [];
      if (Array.isArray(t.fileIdList) && t.fileIdList.length > 0) {
        for (let fileId of t.fileIdList) {
          roomFileIdList.push({
            fileId: fileId
          });
          taskData.taskPhoto.push({
            fileId: fileId
          });
        }
      }

      if (t.result === 'error') {
        roomTaskResult = 'error';
        taskData['errorSub'] = t.errorSub;
        taskData['serviceList'] = t.faultType;
        taskData['richText_4ynjot5'] = {
          raw: t.errorDesc
        };
        taskData['errorText'] = t.errorDesc;
      } else {
        taskData['richText_4ynjot5'] = {
          raw: ''
        };
      }
    }
    batchCreateObject.records.push(taskData);
    batchUpdateTaskObject.records.push({
      _id: t._id,
      complete_status: {
        apiName: 'done'
      },
      option_fm1cv3f: {
        apiName: 'option_d0bl0cu'
      }
    });
  }
  console.log('batchCreateObject', batchCreateObject);
  const planId = taskList[0].plan_list_id._id;
  const overDate = taskList[0].referenceField_jfjimls;
  const notNeedText = noNeedParams ? noNeedParams.desc : '';
  const notNeedPatrol = noNeedParams ? { _id: noNeedParams.id } : null;
  updateRoomTaskResult(
    roomTaskId,
    roomTaskResult,
    roomFileIdList,
    userNewId,
    notNeedText,
    notNeedPatrol
  )
    .then((res) => {
      console.log('updateRoomTaskResult success', res);
      if (res.data.result.code === '0') {
        uploadItemTaskResult(batchCreateObject, planId, overDate)
          .then((ress) => {
            if (res.code === '0') {
              console.log('uploadItemTaskResult success', ress);
              batchUpdateTask(batchUpdateTaskObject).then((resss) => {
                console.log('batchUpdateTask success', resss);
                callback(resss);
              });
            }
          })
          .catch((err) => {
            console.error('uploadItemTaskResult fail', err);
          });
      } else {
        Taro.showToast({
          title: i18n.failTips,
          icon: 'error'
        });
      }
    })
    .catch((err) => {
      console.error('updateRoomTaskResult fail', err);
      callback(err);
      Taro.showToast({
        title: i18n.failTips,
        icon: 'error'
      });
    });
};

/**
 * 更新巡检设备层面记录
 * @param {*} taskList
 * @param {*} type
 * @param {*} roomTaskId
 * @param {*} userInfo
 * @param {*} noNeedParams
 * @param {*} callback
 */
export const saveTask = (taskList, type, roomTaskId, userInfo, noNeedParams = null, callback) => {
  console.log('taskList', taskList);
  const { userId, userNewId } = userInfo;
  let batchUpdateObject = {
    records: []
  };
  let roomTaskResult = 'normal';
  let roomFileIdList = [];
  for (let index = 0; index < taskList.length; index++) {
    const t = taskList[index];
    console.log('t', t);
    const resultData = {
      _id: t._id,
      option_n78g80c: {
        apiName: t.result
      },
      actual_inspector: {
        _id: parseInt(userNewId)
      }
    };
    if (type === 'roomUse') {
      resultData['taskPhoto'] = [];
      roomTaskResult = 'roomuse';
      resultData['option_n78g80c'] = {
        apiName: 'roomuse'
      };
    } else if (type === 'noNeed') {
      resultData['taskPhoto'] = [];
      roomTaskResult = 'notneed';
      resultData['option_n78g80c'] = {
        apiName: 'notneed'
      };
    } else {
      resultData.taskPhoto = [];
      console.log('t.fileIdList', t.fileIdList);
      // 这里需要将历史的和新增的图片都上传
      // 历史
      if (Array.isArray(t.taskPhoto) && t.taskPhoto.length > 0) {
        for (const photo of t.taskPhoto) {
          const fileId = photo.fileId;
          roomFileIdList.push({
            fileId: fileId
          });
          resultData.taskPhoto.push({
            fileId: fileId
          });
        }
      }
      // 新增
      if (Array.isArray(t.fileIdList) && t.fileIdList.length > 0) {
        for (const fileId of t.fileIdList) {
          roomFileIdList.push({
            fileId: fileId
          });
          resultData.taskPhoto.push({
            fileId: fileId
          });
        }
      }
      if (t['result'] === 'error') {
        roomTaskResult = 'error';
        resultData['errorSub'] = t.errorSub;
        resultData['serviceList'] = t.faultType;
        resultData['richText_4ynjot5'] = {
          raw: t.errorDesc ? t.errorDesc : ''
        };
        resultData['errorText'] = t.errorDesc ? t.errorDesc : '';
      } else {
        resultData['richText_4ynjot5'] = {
          raw: ''
        };
        resultData['errorText'] = '';
        resultData['serviceList'] = {};
        resultData['errorSub'] = {};
      }
    }
    batchUpdateObject['records'].push(resultData);
  }
  const notNeedText = noNeedParams ? noNeedParams.desc : '';
  const notNeedPatrol = noNeedParams ? { _id: noNeedParams.id } : null;
  console.log('batchUpdateObject', batchUpdateObject);
  batchUpdateTaskHistoryRecords(batchUpdateObject).then((res) => {
    console.log('batchUpdateTaskHistoryRecords success', res);
    if (res.data.result.code === '0') {
      Taro.showToast({
        title: i18n.updateInspecLoading,
        duration: 2000,
        icon: 'loading',
        success: function () {
          updateRoomTaskHistory(
            roomTaskId,
            roomTaskResult,
            roomFileIdList,
            notNeedText,
            notNeedPatrol
          ).then((res) => {
            callback(res);
          });
        }
      });
    } else {
      Taro.showToast({
        title: i18n.failTips,
        icon: 'error'
      });
    }
  });
};
/**
 * 获取房间任务列表
 * @param {*} params
 * @param {*} dispatch
 */
export const getRoomTaskListAction = (params, dispatch, originalRoomList, setLoading) => {
  const {
    searchCondition,
    siteId,
    offset,
    selectedPlanIds,
    selectedFloorIds,
    selectedRoomTypeIds,
    limitRoomType
  } = params;
  const filter = [
    {
      leftValue: 'taskState',
      operator: 'eq',
      rightValue: 'undo'
    }
  ];
  // 搜索条件
  if (searchCondition) {
    //searchCondition 按空格分割成数组
    const searchConditionArr = searchCondition.split(' ');
    // 生成搜索条件
    let op = { or: [] };
    searchConditionArr.forEach((item) => {
      if (item && item !== '') {
        op.or.push({
          leftValue: 'inspection_room',
          operator: 'contain',
          rightValue: item
        });
        op.or.push({
          leftValue: 'inspection_plan',
          operator: 'contain',
          rightValue: item
        });
        op.or.push({
          leftValue: 'inspection_type_cn',
          operator: 'contain',
          rightValue: item
        });
        op.or.push({
          leftValue: 'inspection_type_en',
          operator: 'contain',
          rightValue: item
        });
        op.or.push({
          leftValue: 'inspection_room_fake_fuzzysearch',
          operator: 'contain',
          rightValue: item
        });
      }
    });
    if (op.or.length > 0) {
      filter.push(op);
    }
  }
  //   计划筛选
  if (Array.isArray(selectedPlanIds) && selectedPlanIds.length > 0) {
    const List = [];
    for (let planId of selectedPlanIds) {
      List.push({
        leftValue: 'planObject._id',
        operator: 'eq',
        rightValue: planId
      });
    }
    filter.push({
      or: List
    });
  }
  //   楼层筛选
  if (Array.isArray(selectedFloorIds) && selectedFloorIds.length > 0) {
    var List = [];
    for (let floor of selectedFloorIds) {
      List.push({
        leftValue: 'floor',
        operator: 'eq',
        rightValue: floor
      });
    }
    filter.push({
      or: List
    });
  }
  //   巡检类型筛选
  if (Array.isArray(selectedRoomTypeIds) && selectedRoomTypeIds.length > 0) {
    const List = [];
    for (let type of selectedRoomTypeIds) {
      List.push({
        leftValue: 'room_type',
        operator: 'eq',
        rightValue: type
      });
    }
    filter.push({
      or: List
    });
  }
  //巡检组限制
  if (Array.isArray(limitRoomType) && limitRoomType.length > 0) {
    let roomTypeFilterList = [];
    for (const rt of limitRoomType) {
      roomTypeFilterList.push({
        leftValue: 'room_type',
        operator: 'eq',
        rightValue: rt._id
      });
    }
    filter.push({
      or: roomTypeFilterList
    });
  }
  getRoomTaskList(siteId, filter, offset).then((res) => {
    const queryDataList = res.data.records;
    const roomTaskList = queryDataList.map((item) => {
      const floorInfo = item.floor;
      let floorName = floorInfo._name;
      if (!floorInfo._name.includes('B')) {
        floorName = floorName + 'F';
      }
      // 时区
      const plan_timezone = item.plan_timezone?.apiName;
      let planTimeZone = 8;
      if (plan_timezone?.includes('option_T')) {
        planTimeZone = plan_timezone.split('_T')[1];
      } else if (plan_timezone?.includes('option_F')) {
        planTimeZone = 0 - plan_timezone.split('_F')[1];
      }
      return {
        ...item,
        floorName: floorName,
        planTimeZone: parseInt(planTimeZone)
      };
    });
    const roomTaskTotal = res.data.total;
    originalRoomList.push(...roomTaskList);
    console.log('originalRoomList', originalRoomList.length);
    dispatch({
      type: GETROOMTASKLIST,
      payload: {
        roomTaskList: originalRoomList,
        roomTaskTotal: roomTaskTotal
      }
    });
    setLoading(false);
  });
};

export const getTodayDoneRoomTaskListAction = (
  params,
  originalList,
  historyType,
  userNewId,
  dispatch,
  setLoading
) => {
  const { siteInfo, offset, selectedPlanIds, selectedFloorIds, selectedResultIds } = params;
  const siteId = siteInfo._id;
  // 站点时区
  // 时区
  const site_timezone = siteInfo.time_zone?.apiName;
  let siteTimeZone = 8;
  if (site_timezone?.includes('option_T')) {
    siteTimeZone = site_timezone.split('_T')[1];
  } else if (site_timezone?.includes('option_F')) {
    siteTimeZone = 0 - site_timezone.split('_F')[1];
  }
  const localDate = new Date(new Date().valueOf() + siteTimeZone * 60 * 60 * 1000);
  const todayTimeStamp = new Date(localDate.toJSON().substring(0, 10)).valueOf();
  const nowTimeStamp = new Date(localDate.toJSON()).valueOf();
  const filter = [
    {
      leftValue: 'taskState',
      operator: 'eq',
      rightValue: 'done'
    },
    {
      leftValue: 'datetime_afsqnsu',
      operator: 'gte',
      rightValue: parseInt(todayTimeStamp)
    },
    {
      leftValue: 'datetime_afsqnsu',
      operator: 'lte',
      rightValue: parseInt(nowTimeStamp)
    }
  ];
  console.log('historyType', historyType);
  if (historyType === 'user') {
    filter.push({
      leftValue: 'user',
      operator: 'eq',
      rightValue: userNewId
    });
  }
  //   楼层筛选
  if (Array.isArray(selectedFloorIds) && selectedFloorIds.length > 0) {
    var List = [];
    for (let floor of selectedFloorIds) {
      List.push({
        leftValue: 'floor',
        operator: 'eq',
        rightValue: floor
      });
    }
    filter.push({
      or: List
    });
  }
  //   计划筛选
  if (Array.isArray(selectedPlanIds) && selectedPlanIds.length > 0) {
    const List = [];
    for (let planId of selectedPlanIds) {
      List.push({
        leftValue: 'planObject._id',
        operator: 'eq',
        rightValue: planId
      });
    }
    filter.push({
      or: List
    });
  }
  //   巡检类型筛选
  if (Array.isArray(selectedResultIds) && selectedResultIds.length > 0) {
    const List = [];
    for (let result of selectedResultIds) {
      List.push({
        leftValue: 'taskResult',
        operator: 'eq',
        rightValue: result
      });
    }
    filter.push({
      or: List
    });
  }
  getRoomTaskList(siteId, filter, offset).then((res) => {
    const queryDataList = res.data.records;
    const roomTaskList = queryDataList.map((item) => {
      const floorInfo = item.floor;
      let floorName = floorInfo._name;
      if (!floorInfo._name.includes('B')) {
        floorName = floorName + 'F';
      }

      // 时区
      const plan_timezone = item.plan_timezone?.apiName;
      let planTimeZone = 8;
      if (plan_timezone?.includes('option_T')) {
        planTimeZone = plan_timezone.split('_T')[1];
      } else if (plan_timezone?.includes('option_F')) {
        planTimeZone = 0 - plan_timezone.split('_F')[1];
      }
      return {
        ...item,
        floorName: floorName,
        planTimeZone: parseInt(planTimeZone)
      };
    });
    const roomTaskTotal = res.data.total;
    originalList.push(...roomTaskList);
    console.log('originalList', originalList.length);
    // callback({
    //   roomHistoryList: originalList,
    //   roomHistoryTotal: roomTaskTotal
    // });
    dispatch({
      type: GETROOMTASKHISTORYLIST,
      payload: {
        roomHistoryList: originalList,
        roomHistoryTotal: roomTaskTotal
      }
    });
    setLoading(false);
  });
};
/**
 * 获取设备任务列表
 * @param {*} payload
 * @param {*} dispatch
 */
export const getTaskListAction = (payload, dispatch, setLoading) => {
  getRoomMriDeviceList(payload).then((mriRes) => {
    console.log('getRoomMriDeviceList===>', mriRes);
    let mriList = []
    if(mriRes?.data?.items) {
      mriList = mriRes?.data?.items.map((item) => {
        return {
          ...item,
          device_type_id: item?.lookup_item?._id || item?.lookup_item?.id
        }
      })
    }
    getTaskList(payload).then((res) => {
      const queryDataList = res.data.records.map((item) => {
        const deviceType = item.deviceType?._id || item.deviceType?.id
        return {
          ...item,
          mriList: mriList.filter((mriItem) => mriItem.device_type_id == deviceType),
          result: 'normal',
          errorDesc: '',
          errorSub: {
            apiName: 'errorNotReslove'
          },
          photoList: []
        };
      });
      // const taskList = queryDataList.sort((a, b) => {
      //   return a.sortNumber - b.sortNumber;
      // });
      let sortList = new Array(queryDataList.length);
      for (let task of queryDataList) {
        if (task.sortNumber === null) {
          sortList = queryDataList;
        } else {
          sortList[task['sortNumber']] = task;
        }
      }
      sortList = sortList.filter(Boolean);
      console.log('getTaskListAction taskList', sortList);
      let isSubmit = true;
      for (let i = 0; i < sortList.length; i++) {
        // 拉取任务列表的时候, 如果计划需要拍照 && 基础设置一定得拍照
        // 不拍照的话不允许允许提交
        const item = sortList[i];
        const { isMustPhoto, isPhoto } = item;
        if (isMustPhoto.apiName === 'allow' && isPhoto.apiName === 'need') {
          isSubmit = false;
          break;
        }
      }
      dispatch({
        type: GETTASKLIST,
        payload: {
          taskList: sortList
        }
      });
      dispatch({
        type: UPDATETASKLISTISSUBMITSTATUS,
        payload: {
          isSubmit: isSubmit
        }
      });
      setLoading(false);
    });
  })

};

/**
 * @deprecated
 * @param params
 * @param setTaskList
 * @param setLoading
 */
export const setOccupiedRoomTaskDetail = (params, setTaskList, setLoading) => {
  getOccupiedRoomTaskList(params).then((res) => {
    const queryDataList = res.data.records.map((item) => {
      return {
        ...item,
        result: 'normal',
        errorDesc: '',
        errorSub: {
          apiName: 'errorNotReslove'
        },
        photoList: []
      };
    });
    let sortList = new Array(queryDataList.length);
    for (let task of queryDataList) {
      if (task.sortNumber === null) {
        sortList = queryDataList;
      } else {
        sortList[task['sortNumber']] = task;
      }
    }
    sortList = sortList.filter(Boolean);
    console.log('setOccupiedRoomTaskDetail taskList', sortList);
    setTaskList(sortList);
    setLoading(false);
  }).catch((err) => {
    console.error('setOccupiedRoomTaskDetail taskList', err);
    setTaskList([]);
    setLoading(false);
  });
};

/**
 * 获取巡检记录列表
 * @param {*} params
 * @param {*} dispatch
 * @param {*} setLoading
 * @param setLocalImgFileName2APaaSFileId
 */
export const getHistoryTaskListAction = async (params, dispatch, setLoading, setLocalImgFileName2APaaSFileId) => {
  const { roomTaskId } = params;
  const res = await getHistoryTaskList(roomTaskId);
  console.log('getHistoryTaskListAction response', res);
  const mapping = {};
  const manager = Taro.getFileSystemManager(); // 获取全局唯一的文件管理器
  let taskHistoryList = [];
  const promiseList = [];
  const fileIdList = [];
  for (let i = 0; i < res.data.records.length; i++) {
    const item = res.data.records[i];
    let photoList = [];
    let result = '';
    switch (item['option_n78g80c']?.apiName) {
      case 'normal':
        result = 'normal';
        break;
      case 'error':
        result = 'error';
        break;
      case 'nothave':
        result = 'nothave';
        break;
      default:
        break;
    }
    // console.log('getHistoryTaskListAction', item);
    if (Array.isArray(item.taskPhoto) && item.taskPhoto.length > 0) {
      for (let i of item.taskPhoto) {
        const fileId = i.fileId;
        photoList.push(fileId);
        fileIdList.push(fileId);
        promiseList.push(getFileInfo(fileId));
      }
    }
    taskHistoryList.push({
      ...item,
      result: result,
      photoList: photoList,
      faultType: item.serviceList,
      errorDesc: item.richText_4ynjot5?.raw,
      deviceType: item.item_type
    }
    );
  }

  if (promiseList.length > 0) {
    const promiseResults = [];
    const chunks = chunkArray(promiseList, 10);
    for (let i = 0; i < chunks.length; i++) {
      const item = chunks[i];
      const result = await Promise.all(item);
      promiseResults.push(...result);
    }
    for (let j = 0; j < promiseResults.length; j++) {
      const fileInfoRes = await promiseResults[j];
      if (fileInfoRes.statusCode === 200) {
        console.log('getFileInfo', fileInfoRes);
        console.log(fileInfoRes.data);
        const fileId = fileIdList[j];
        console.log('fileId', fileId);
        const filePrefix = String(Math.random().toString(16).substring(2));
        Object.assign(mapping, { [filePrefix]: fileId });
        console.log('filePrefix', filePrefix);
        manager.writeFile({
          filePath: 'ttfile://user/' + filePrefix + '.png',
          data: fileInfoRes.data,
          encoding: 'base64',
          success(callback) {
            console.log('writeFile success', callback);
            for (let i = 0; i < taskHistoryList.length; i++) {
              const task = taskHistoryList[i];
              const { photoList } = task;
              const index = photoList.findIndex(tempId => typeof tempId === 'string' && tempId === fileId);
              if (index !== -1) {
                taskHistoryList[i].photoList[index] = {
                  status: 'success',
                  url: `ttfile://user/${filePrefix}.png`,
                  path: `ttfile://user/${filePrefix}.png`
                };
                break;
              }
            }
          },
          fail(callback) {
            console.log('writeFile fail', callback);
          }
        });
      }
    }
  }

  console.log('mapping', mapping);
  setLocalImgFileName2APaaSFileId(mapping);
  dispatch({
    type: GETTASKHISTORYLIST,
    payload: {
      taskHistoryList: taskHistoryList
    }
  });
  setLoading(false);
  // await Taro.showLoading({ title: i18n.loadingPhoto });
};

const chunkArray = (array, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

/**
 * 修改设备任务列表数据
 * @param {*} taskList
 * @param {*} dispatch
 */
export const setTaskListAction = (taskList, dispatch) => {
  let i = 0;
  console.log('setTaskListAction', taskList);
  for (let index = 0; index < taskList.length; index++) {
    const task = taskList[index];
    if (task.isPhoto?.apiName === 'need' && task.isMustPhoto?.apiName === 'allow') {
      if (task.result !== 'nothave' && task.photoList.length === 0) {
        i += 1;
      }
    }
    if (task.result === '') {
      i += 1;
    } else if (task.result === 'error') {
      if (
        task.isPhoto?.apiName === 'need' &&
        task.isMustPhoto?.apiName === 'allow' &&
        task.photoList.length === 0
      ) {
        i += 1;
      }
      // 故障类型
      if (task.isShowErrorType?.apiName === 'show' && task.faultType === undefined) {
        i += 1;
      }
      if (task.is_error_desc_info && !task.errorDesc) {
        i += 1;
      }
    }
  }
  console.log('setTaskListAction', i);

  dispatch({
    type: UPDATETASKLISTISSUBMITSTATUS,
    payload: {
      isSubmit: i === 0
    }
  });
  dispatch({
    type: GETTASKLIST,
    payload: {
      taskList: taskList
    }
  });
};

/**
 * 修改设备任务列表历史数据
 * @param {Array} taskHistoryList
 * @param {*} dispatch
 */
export const setTaskHistoryListAction = (taskHistoryList, dispatch) => {
  console.log('setTaskHistoryListAction', taskHistoryList);
  let i = 0;
  for (let index = 0; index < taskHistoryList.length; index++) {
    const task = taskHistoryList[index];
    console.log('task', task);
    let taskPhotoLength = 0;
    let fileIdListLength = 0;
    let picTotal = 0;
    if (task?.taskPhoto && Array.isArray(task.taskPhoto)) {
      taskPhotoLength = task.taskPhoto.length;
    }
    if (task?.fileIdList && Array.isArray(task.fileIdList)) {
      fileIdListLength = task.fileIdList.length;
    }
    picTotal = taskPhotoLength + fileIdListLength;
    // console.log('taskPhotoLength', taskPhotoLength);
    // console.log('fileIdListLength', fileIdListLength);
    // console.log('picTotal', picTotal);
    if (task.isPhoto?.apiName === 'need' && task.isMustPhoto?.apiName === 'allow') {
      if (task.result !== 'nothave' && picTotal === 0) {
        i += 1;
      }
    }
    if (task.result === '') {
      i += 1;
    } else if (task.result === 'error') {
      if (
        task.isPhoto?.apiName === 'need' &&
        task.isMustPhoto?.apiName === 'allow' &&
        picTotal === 0
      ) {
        i += 1;
      }
      // 故障类型
      if (task.isShowErrorType?.apiName === 'show' && task.faultType === undefined) {
        i += 1;
      }
      if (task.is_error_desc_info && !task.errorDesc) {
        i += 1;
      }
    }
  }
  console.log('setTaskListAction', i);

  dispatch({
    type: UPDATETASKLISTISSUBMITSTATUS,
    payload: {
      isSubmit: i === 0
    }
  });
  dispatch({
    type: GETTASKLIST,
    payload: {
      taskList: taskHistoryList
    }
  });
};

/**
 * 获取故障类型列表
 * @param {*} deviceType
 * @param {*} dispatch
 */
export const getFaultTypeListAction = (deviceType, dispatch) => {
  getFaultTypeList(deviceType).then((res) => {
    const faultTypeList = res.data.records;
    dispatch({
      type: SETFAUTYPELTLIST,
      payload: {
        faultTypeList: faultTypeList
      }
    });
  });
};
