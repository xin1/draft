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
