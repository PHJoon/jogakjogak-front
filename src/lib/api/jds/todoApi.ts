import { fetchWithAuth } from '@/lib/api/fetchWithAuth';
import { ApiResponse } from '@/types';
import {
  CreateTodoRequestData,
  TodoItem,
  UpdateTodoRequestData,
} from '@/types/jds';
import throwIfNotOk from '@/utils/throwIfNotOk';

// Todo 완료 상태 토글
export async function toggleCompleteTodo(
  jdId: number,
  todoId: number,
  updatedDoneState: boolean
) {
  const response = await fetchWithAuth(
    `/api/jds/${jdId}/to-do-lists/${todoId}/isDone`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_done: updatedDoneState }),
    }
  );
  await throwIfNotOk(
    response,
    '할 일을 완료 상태로 변경하는 중 오류가 발생했습니다.'
  );
  const data: ApiResponse<TodoItem> = await response.json();
  return data.data;
}

// Todo 상태 수정
export async function updateTodo(
  jdId: number,
  todoId: number,
  updateTodoItem: UpdateTodoRequestData
) {
  const response = await fetchWithAuth(
    `/api/jds/${jdId}/to-do-lists/${todoId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateTodoItem),
    }
  );
  await throwIfNotOk(response, '할 일을 업데이트하는 중 오류가 발생했습니다.');
  const data: ApiResponse<TodoItem> = await response.json();
  return data.data;
}

// Todo 삭제
export async function deleteTodo(jdId: number, todoId: number) {
  const response = await fetchWithAuth(
    `/api/jds/${jdId}/to-do-lists/${todoId}`,
    {
      method: 'DELETE',
    }
  );
  await throwIfNotOk(response, '할 일을 삭제하는 중 오류가 발생했습니다.');
  return { success: true };
}

// Todo 추가
export async function createTodo(
  jdId: number,
  newTodoItem: CreateTodoRequestData
) {
  const response = await fetchWithAuth(`/api/jds/${jdId}/to-do-lists`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTodoItem),
  });
  await throwIfNotOk(response, '할 일을 추가하는 중 오류가 발생했습니다.');
  const data: ApiResponse<TodoItem> = await response.json();
  return data.data;
}

// Todo 알림 신청
export async function updateTodoNotification(
  jdId: number,
  newAlarmState: boolean
) {
  const response = await fetchWithAuth(`/api/jds/${jdId}/alarm`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isAlarmOn: newAlarmState }),
  });

  await throwIfNotOk(response, '알림을 설정하는 중 오류가 발생했습니다.');
  const data: ApiResponse<{ jdId: number; alarmOn: boolean }> =
    await response.json();
  return data.data;
}
