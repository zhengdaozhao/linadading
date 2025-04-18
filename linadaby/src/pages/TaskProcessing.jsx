import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Paper,
  Snackbar,
  Alert
} from '@mui/material';
import workflowService from '../services/workflowService';
import stepService from '../services/StepService';
import taskService from '../services/TaskService';

const STATUS_OPTIONS = ['Not Assigned','Assigned', 'In Progress', 'Pending', 'Done', 'Rejected'];

// function getStepDisplaySteps(workflow, currentStep) {
//   if (!workflow || !workflow.steps || !currentStep) return [];
//   const steps = workflow.steps;

//   // 按 step.label 排序（假设 label 形如 "STEP 1", "STEP 2"）
//   steps.sort((a, b) => {
//     const getNum = label => {
//       const match = label.match(/\d+/);
//       return match ? parseInt(match[0], 10) : 0;
//     };
//     return getNum(a.label) - getNum(b.label);
//   });

//   const idx = steps.findIndex(s => s.id === currentStep.id);
//   if (idx === -1) return [];
//   if (steps.length === 1) return [steps[0]];
//   if (!currentStep.upperStep) return [steps[0], steps[1]];
//   if (!currentStep.nextStep) return [steps[steps.length - 2], steps[steps.length - 1]];
//   if (idx === 0) return [steps[0], steps[1]];
//   if (idx === steps.length - 1) return [steps[steps.length - 2], steps[steps.length - 1]];
//   return [steps[idx - 1], steps[idx], steps[idx + 1]];
// }
function getStepDisplaySteps(workflow, currentStep) {
  if (!workflow || !workflow.steps || !currentStep) return [];
  const steps = workflow.steps;

  // 1. 只有一个step
  if (steps.length === 1) return [{ label: currentStep.label }];

  // 获取prevStep
  let prevStep = null;
  if (currentStep.upperStep) {
    if (currentStep.upperStep.startsWith('branch-')) {
      // branch节点
      const branch = (workflow.branches || []).find(b => b.id === currentStep.upperStep);
      if (branch && branch.upperStep) {
        prevStep = steps.find(s => s.id === branch.upperStep);
      }
    } else if (currentStep.upperStep.startsWith('step-')) {
      prevStep = steps.find(s => s.id === currentStep.upperStep);
    }
    // setPrevStep(prevStep);
  }

  // 获取nextStep
  let nextStep = null;
  if (currentStep.nextStep) {
    if (currentStep.nextStep.startsWith('branch-')) {
      const branch = (workflow.branches || []).find(b => b.id === currentStep.nextStep);
      if (branch && branch.nextStep) {
        nextStep = steps.find(s => s.id === branch.nextStep);
      }
    } else if (currentStep.nextStep.startsWith('step-')) {
      nextStep = steps.find(s => s.id === currentStep.nextStep);
    }
  }

  // 2. 首step（无upperStep）
  if (!currentStep.upperStep && nextStep) {
    return [
      { label: currentStep.label },
      { label: nextStep.label }
    ];
  }
  // 3. 末step（无nextStep）
  if (!currentStep.nextStep && prevStep) {
    return [
      { label: prevStep.label },
      { label: currentStep.label }
    ];
  }
  // 4. 中间step
  if (prevStep && nextStep) {
    return [
      { label: prevStep.label },
      { label: currentStep.label },
      { label: nextStep.label }
    ];
  }
  // 兜底
  return [{ label: currentStep.label }];
}

const TaskProcessing = () => {
  const { stepId } = useParams();
  const [workflowIdInput, setWorkflowIdInput] = useState('');
  const [workflow, setWorkflow] = useState(null);
  const [currentStep, setCurrentStep] = useState(null);
  const [prevStep, setPrevStep] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Editable fields
//   const [assignTo, setAssignTo] = useState('');
  const [tasks, setTasks] = useState([]);

  // 1.1.2 检索按钮
  const handleSearch = async () => {
    if (!workflowIdInput.trim()) {
      setSnackbar({ open: true, message: '请输入workflow id', severity: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const wf = await workflowService.getWorkflowById(workflowIdInput.trim());
      setWorkflow(wf);
      if (wf && wf.steps && wf.steps.length > 0) {
        const step1 = wf.steps.find(s => s.label === 'STEP 1' || s.label === 'Step 1');
        setCurrentStep(step1);
//         setAssignTo(step1?.assignTo || '');
//         setTasks(step1?.tasks ? JSON.parse(JSON.stringify(step1.tasks)) : []);
        setTasks(step1?.tasks ? processTasks(step1.tasks) : []);
      }
    } catch (e) {
      setSnackbar({ open: true, message: '未找到workflow', severity: 'error' });
    }
    setLoading(false);
  };

  // 1.2 通过stepId加载
  useEffect(() => {
    const fetchByStepId = async () => {
      if (!stepId) return;
      setLoading(true);
      try {
        const stepS = await stepService.getStepById(stepId);
        const wf = await workflowService.getWorkflowById(stepS.workflowId);
        setWorkflow(wf);
        // Find the current step in the workflow
        const step = wf.steps.find(s => s.id === stepId);
        setCurrentStep(step);
//         setAssignTo(step.assignTo || '');
//         setTasks(step.tasks ? JSON.parse(JSON.stringify(step.tasks)) : []);
        setTasks(step.tasks ? processTasks(step.tasks) : []);
      } catch (e) {
        setSnackbar({ open: true, message: '未找到step或workflow', severity: 'error' });
      }
      setLoading(false);
    };
    if (stepId) fetchByStepId();
  }, [stepId]);

  // 2.3.3 Prev/Next
//   const handlePrev = () => {
//     if (!workflow || !currentStep) return;
//     let prevStepId = currentStep.upperStep;
//     if (!prevStepId) return;
//     // branch处理
//     if (prevStepId.startsWith('branch-')) {
//       const branch = workflow.branches?.find(b => b.id === prevStepId);
//       if (branch && branch.upperStep) prevStepId = branch.upperStep;
//       else return;
//     }
// //     const prevStep = workflow.steps?.find(s => s.id === prevStepId);
// //     if (prevStep) {
// //       setCurrentStep(prevStep);
// // //       setAssignTo(prevStep.assignTo || '');
// // //       setTasks(prevStep.tasks ? JSON.parse(JSON.stringify(prevStep.tasks)) : []);
// //       setTasks(prevStep.tasks ? processTasks(prevStep.tasks) : []);
// //     }
//     // 关键：每次切换都重新拉取step和workflow
//     try {
//       const stepS = stepService.getStepById(prevStepId);
//       const wf = workflowService.getWorkflowById(stepS.workflowId);
//       setWorkflow(wf);
//       const step = wf.steps.find(s => s.id === prevStepId);
//       setCurrentStep(step);
//       setTasks(step ? processTasks(step.tasks) : []);
//     } catch (e) {
//       setSnackbar({ open: true, message: '加载step失败', severity: 'error' });
//     }
//   };
//   const handleNext = () => {
//     if (!workflow || !currentStep) return;
//     let nextStepId = currentStep.nextStep;
//     if (!nextStepId) return;
//     // branch处理
//     if (nextStepId.startsWith('branch-')) {
//       const branch = workflow.branches?.find(b => b.id === nextStepId);
//       if (branch && branch.nextStep) nextStepId = branch.nextStep;
//       else return;
//     }
// //     const nextStep = workflow.steps?.find(s => s.id === nextStepId);
// //     if (nextStep) {
// //       setCurrentStep(nextStep);
// // //       setAssignTo(nextStep.assignTo || '');
// // //       setTasks(nextStep.tasks ? JSON.parse(JSON.stringify(nextStep.tasks)) : []);
// //       setTasks(nextStep.tasks ? processTasks(nextStep.tasks) : []);
// //     }
//   try {
//     const stepS = stepService.getStepById(nextStepId);
//     const wf = workflowService.getWorkflowById(stepS.workflowId);
//     setWorkflow(wf);
//     const step = wf.steps.find(s => s.id === nextStepId);
//     setCurrentStep(step);
//     setTasks(step ? processTasks(step.tasks) : []);
//   } catch (e) {
//     setSnackbar({ open: true, message: '加载step失败', severity: 'error' });
//   }
//   };
  // 2.3.3 Prev/Next
  const handlePrev = async () => {
    if (!workflow || !currentStep) return;
    let prevStepId = currentStep.upperStep;
    if (!prevStepId) return;
    // branch处理
    if (prevStepId.startsWith('branch-')) {
      const branch = workflow.branches?.find(b => b.id === prevStepId);
      if (branch && branch.upperStep) {
        prevStepId = branch.upperStep;
      } else {
        setSnackbar({ open: true, message: '未找到branch的upperStep', severity: 'warning' });
        return;
      }
    }
    try {
      // 递归处理：如果prevStepId还是branch，继续查找，直到是step-开头
      while (prevStepId && prevStepId.startsWith('branch-')) {
        const branch = workflow.branches?.find(b => b.id === prevStepId);
        if (branch && branch.upperStep) {
          prevStepId = branch.upperStep;
        } else {
          setSnackbar({ open: true, message: '未找到branch的upperStep', severity: 'warning' });
          return;
        }
      }
      const stepS = await stepService.getStepById(prevStepId);
      const wf = await workflowService.getWorkflowById(stepS.workflowId);
      setWorkflow(wf);
      const step = wf.steps.find(s => s.id === prevStepId);
      setCurrentStep(step);
      setTasks(step ? processTasks(step.tasks) : []);
    } catch (e) {
      setSnackbar({ open: true, message: '加载step失败', severity: 'error' });
    }
  };

  const handleNext = async () => {
    if (!workflow || !currentStep) return;
    let nextStepId = currentStep.nextStep;
    if (!nextStepId) return;
    // branch处理
    if (nextStepId.startsWith('branch-')) {
      const branch = workflow.branches?.find(b => b.id === nextStepId);
      if (branch && branch.nextStep) {
        nextStepId = branch.nextStep;
      } else {
        setSnackbar({ open: true, message: '未找到branch的nextStep', severity: 'warning' });
        return;
      }
    }
    try {
      // 递归处理：如果nextStepId还是branch，继续查找，直到是step-开头
      while (nextStepId && nextStepId.startsWith('branch-')) {
        const branch = workflow.branches?.find(b => b.id === nextStepId);
        if (branch && branch.nextStep) {
          nextStepId = branch.nextStep;
        } else {
          setSnackbar({ open: true, message: '未找到branch的nextStep', severity: 'warning' });
          return;
        }
      }
      const stepS = await stepService.getStepById(nextStepId);
      const wf = await workflowService.getWorkflowById(stepS.workflowId);
      setWorkflow(wf);
      const step = wf.steps.find(s => s.id === nextStepId);
      setCurrentStep(step);
      setTasks(step ? processTasks(step.tasks) : []);
    } catch (e) {
      setSnackbar({ open: true, message: '加载step失败', severity: 'error' });
    }
  };
  // 任务更新
  const handleTaskChange = (idx, field, value) => {
    setTasks(ts => {
      const copy = [...ts];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // innerNode更新
  const handleInnerNodeChange = (taskIdx, nodeIdx, field, value) => {
    setTasks(ts => {
      const copy = [...ts];
      const nodes = copy[taskIdx].innerNodes ? [...copy[taskIdx].innerNodes] : [];
      const node = { ...nodes[nodeIdx] };
      node.data = { ...node.data, [field]: value }; // 正确地更新data下的字段
      nodes[nodeIdx] = node;
      copy[taskIdx].innerNodes = nodes;
      return copy;
    });
  };
  // 加载tasks时，增加isTaskInitiallyEditable字段
  const processTasks = (tasks) =>
    (tasks || []).map(t => ({
      ...t,
      isTaskInitiallyEditable: !['Done', 'Rejected'].includes(t.status)
    }));
  // 更新assignTo
//   const handleAssignToChange = (e) => setAssignTo(e.target.value);

  // 更新task
//   const handleUpdateTask = async (taskIdx) => {
//     const task = tasks[taskIdx];
//     try {
//       await taskService.updateTask(task.id,task);
//       setSnackbar({ open: true, message: 'Task已更新', severity: 'success' });
//       // 检查所有task是否Done
//       const allDone = tasks.every(t => t.status === 'Done');
//       if (allDone) {
//         // 更新step状态
//         const updatedStep = { ...currentStep, status: 'Completed' };
//         await stepService.updateStep(updatedStep.id,updatedStep);
//         setCurrentStep(updatedStep);
//         setSnackbar({ open: true, message: 'Step已完成', severity: 'success' });
//         // branch/skip/active逻辑略（可补充递归处理）
//         // 检查workflow是否全部完成
//         if (workflow.steps.every(s => s.status === 'Completed' || s.status === 'Skipped')) {
//           const updatedWf = { ...workflow, status: 'Completed' };
//           await workflowService.updateWorkflow(updatedWf);
//           setWorkflow(updatedWf);
//           setSnackbar({ open: true, message: 'this workflow is completed!', severity: 'success' });
//         }
//       }
//     } catch (e) {
//       setSnackbar({ open: true, message: '更新失败', severity: 'error' });
//     }
//   };
const handleUpdateTask = async (taskIdx) => {
  const task = tasks[taskIdx];
  // 获取原始task（假设currentStep.tasks里是原始数据）
  const originalTask = (currentStep?.tasks || []).find(t => t.id === task.id);
  // 比较内容是否有变化（只比较常用字段，可根据实际情况扩展）
  const isUnchanged =
    originalTask &&
    task.assignTeam === originalTask.assignTeam &&
    task.status === originalTask.status &&
    task.description === originalTask.description &&
    JSON.stringify(task.innerNodes) === JSON.stringify(originalTask.innerNodes);

  if (isUnchanged) {
    setSnackbar({ open: true, message: 'There is no change of the task.', severity: 'info' });
    return;
  }

  try {
    await taskService.updateTask(task.id, task);
    setSnackbar({ open: true, message: 'Task已更新', severity: 'success' });
    // 检查所有task是否Done
    const allDone = tasks.every(t => t.status === 'Done');
    if (allDone) {
      // 更新step状态
      const updatedStep = { ...currentStep, status: 'Completed' };
      await stepService.updateStep(updatedStep.id, updatedStep);
      setCurrentStep(updatedStep);
      setSnackbar({ open: true, message: 'Step已完成', severity: 'success' });

      // 新增：如果有nextStep，把它的status设为Active
      if (currentStep.nextStep) {
        let nextStepId = currentStep.nextStep;
        // branch处理
        if (nextStepId.startsWith('branch-')) {
          const branch = workflow.branches?.find(b => b.id === nextStepId);
          if (branch && branch.nextStep) nextStepId = branch.nextStep;
        }
        // 拉取nextStep并更新
        try {
          const nextStep = await stepService.getStepById(nextStepId);
          if (nextStep && nextStep.status === 'Waiting') {
            const updatedNextStep = { ...nextStep, status: 'Active' };
            await stepService.updateStep(updatedNextStep.id, updatedNextStep);
          }
        } catch (e) {
          setSnackbar({ open: true, message: '更新下一步状态失败', severity: 'warning' });
        }
      }


      // branch/skip/active逻辑略（可补充递归处理）
      // 检查workflow是否全部完成
      if (workflow.steps.every(s => s.status === 'Completed' || s.status === 'Skipped')) {
        const updatedWf = { ...workflow, status: 'Completed' };
        await workflowService.updateWorkflow(updatedWf);
        setWorkflow(updatedWf);
        setSnackbar({ open: true, message: 'this workflow is completed!', severity: 'success' });
      }
    }
  } catch (e) {
    setSnackbar({ open: true, message: '更新失败', severity: 'error' });
  }
};
  // 2.3.1 步骤条
  const stepDisplayArr = getStepDisplaySteps(workflow, currentStep);

  // 2.3.2.2.0 是否可编辑
  //   const isStepEditable = currentStep && !['Completed', 'Skipped'].includes(currentStep.status);
  const isStepEditable =
    currentStep &&
    currentStep.status === 'Active'; // 只有Active时可编辑

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper sx={{ width: 1100, p: 3 }}>
        {/* 1.1 检索区 */}
        {!stepId && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Workflow ID"
              value={workflowIdInput}
              onChange={e => setWorkflowIdInput(e.target.value)}
              disabled={!!stepId}
              size="small"
              sx={{ width: 400 }}
            />
            <Button variant="contained" 
                onClick={handleSearch} 
                disabled={!!stepId || loading}
                sx={{ width: 120 }}
                >
              检索
            </Button>
          </Box>
        )}

        {/* 2.3.1 步骤条 */}
{/* <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
  {stepDisplayArr.map((s, idx) => (
    <React.Fragment key={s.id}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: s.id === currentStep?.id ? 'bold' : 'normal',
          color: s.id === currentStep?.id ? 'primary.main' : 'text.secondary',
          mx: 1,
          fontSize: '2.4rem' // 3倍放大
        }}
      >
        {s.label}
      </Typography>
      {idx < stepDisplayArr.length - 1 && (
  <Typography variant="subtitle1" sx={{ fontSize: '2.4rem' }}>
    {'    >    '}
  </Typography>
)}
    </React.Fragment>
  ))}
</Box> */}
{/* // 步骤条渲染部分 */}
<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
  {stepDisplayArr.map((s, idx) => (
    <React.Fragment key={idx}>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: s.label === currentStep?.label ? 'bold' : 'normal',
          color: s.label === currentStep?.label ? 'primary.main' : 'text.secondary',
          mx: 1,
          fontSize: '2.4rem'
        }}
      >
        {s.label}
      </Typography>
      {idx < stepDisplayArr.length - 1 && (
        <Typography variant="subtitle1" sx={{ fontSize: '2.4rem' }}>
          {'    >    '}
        </Typography>
      )}
    </React.Fragment>
  ))}
</Box>
        {/* 2.3.2 内容区 */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: 320,
            maxHeight: 320,
            overflowY: 'auto',
            border: '1px solid #eee',
            borderRadius: 2,
            p: 2,
            mb: 2
          }}
        >
          {/* 左侧空白 */}
          <Box sx={{ flex: 1 }} />
          {/* 中间内容 */}
          <Box sx={{ flex: 8, minWidth: 400 }}>
            {workflow && currentStep ? (
              <Box>
                <Typography variant="h6" sx={{ mb: 1, display: 'inline', fontWeight: 'bold', color: '#0047ab' }}>
                  Workflow:
                </Typography>
                <Typography variant="h6" sx={{ mb: 1, display: 'inline', ml: 1 }}>
                  {workflow.name}
                </Typography>
                <Divider sx={{ mb: 1 }} />
                <Typography fontWeight="bold" color='#0047ab'  variant="subtitle1">Step信息</Typography>
                <Box sx={{ pl: 2, mb: 1 }}>
                  <Typography>label: {currentStep.label}</Typography>
                  <Typography>workflowId: {currentStep.workflowId}</Typography>
{/*                   <Typography>Assign Team: {currentStep.assignTo}</Typography> */}
{/*                   <TextField
                    label="assignTo"
                    value={currentStep.assignTo}
                    onChange={handleAssignToChange}
                    size="small"
                    sx={{ my: 1 }}
                    disabled={!isStepEditable}
                  /> */}
                  <Typography color='red' fontSize={28}>status: {currentStep.status}</Typography>
                </Box>
                <Divider sx={{ mb: 1 }} />
                {/*                 <Typography  fontWeight="bold" color='#0047ab' variant="subtitle1">Tasks</Typography> */}
                <Typography fontWeight="bold" color="#228b22" variant="subtitle1">
                  There are {tasks.length} tasks in this step
                </Typography>
                <Divider sx={{ my: 1 }} />
                                {tasks && tasks.length > 0 ? (
                                  tasks.map((task, idx) => {
                  const isTaskEditable = isStepEditable && task.isTaskInitiallyEditable;
                  return (
                    <Box key={task.id || idx} sx={{ pl: 2, mb: 2 }}>
{/*                       <Typography>name: {task.name}</Typography> */}
                      <Typography color='#a52a2a'> {task.name}</Typography>
                      <br />
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TextField
                              label="Assign Team"
                              value={task.assignTeam || ''}
                              // onChange={e => handleTaskChange(idx, 'description', e.target.value)}
                              size="small"
                              sx={{ mr: 2 }}
                              disabled={true}
                            />
                        <FormControl sx={{ minWidth: 120, mr: 2 }} size="small" disabled={!isTaskEditable}>
                          <InputLabel>status</InputLabel>
                          <Select
                            value={task.status || ''}
                            label="status"
                            onChange={e => handleTaskChange(idx, 'status', e.target.value)}
                          >
                            {STATUS_OPTIONS.map(opt => (
                              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <TextField
                              label="description"
                              value={task.description || ''}
                              onChange={e => handleTaskChange(idx, 'description', e.target.value)}
                              size="small"
                              sx={{ mr: 2 }}
                              disabled={!isTaskEditable}
                            />
                      </Box>
                      <Typography>templateId: {task.templateId}</Typography>
                      {/* innerNodes */}
                      {task.innerNodes && task.innerNodes.length > 0 && (
                        <Box sx={{ pl: 2, mt: 1 }}>
                          <Typography color="#0047ab" variant="body2">InnerNodes:</Typography>
                          {task.innerNodes.map((node, nidx) => (
                            <Box key={node.id || nidx} sx={{ pl: 2, mb: 1 }}>
                              <Typography>label: {node.data?.label}</Typography>
{/*                               <Typography>nodeType: {node.data?.nodeType}</Typography> */}
                              <TextField
                                label="fields"
                                value={node.data?.fields || ''}
                                onChange={e => handleInnerNodeChange(idx, nidx, 'fields', e.target.value)}
                                size="small"
                                sx={{ my: 1 }}
                                disabled={!isTaskEditable}
                              />
                              <Divider sx={{ my: 1 }} />
                            </Box>
                          ))}
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleUpdateTask(idx)}
                          disabled={!isTaskEditable}
                        >
                          update task
                        </Button>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                    </Box>
                  )})
                ) : (
                  <Typography sx={{ pl: 2 }}>无任务</Typography>
                )}
              </Box>
            ) : (
              <Typography color="text.secondary">请检索workflow或选择step</Typography>
            )}
          </Box>
          {/* 右侧空白 */}
          <Box sx={{ flex: 1 }} />
        </Box>

        {/* 2.3.3 Prev/Next */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 30 }}>
          <Button
            variant="contained"
            onClick={handlePrev}
            disabled={!currentStep || !currentStep.upperStep}
sx={{ width: 180 }}
          >
            Prev
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!currentStep || !currentStep.nextStep}
sx={{ width: 180 }}
          >
            Next
          </Button>
        </Box>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={1000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 修改这里
        >
          <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default TaskProcessing;