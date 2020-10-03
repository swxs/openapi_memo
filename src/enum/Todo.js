export const TODO_STATUS_DICT = {
    TODO_STATUS_新_建: 1, // new
    TODO_STATUS_进_行_中: 2, // doing
    TODO_STATUS_暂_停_中: 3, // waiting
    TODO_STATUS_完_成: 4, // done
}
export const TODO_PRIORITY_DICT = {
    TODO_PRIORITY_低: 1, // low
    TODO_PRIORITY_中: 2, // normal
    TODO_PRIORITY_高: 3, // high
}

export const TODO_STATUS_LIST = [
    [TODO_STATUS_DICT.TODO_STATUS_新_建, '新建'],
    [TODO_STATUS_DICT.TODO_STATUS_进_行_中, '进行中'],
    [TODO_STATUS_DICT.TODO_STATUS_暂_停_中, '暂停中'],
    [TODO_STATUS_DICT.TODO_STATUS_完_成, '完成'],
]
export const TODO_PRIORITY_LIST = [
    [TODO_PRIORITY_DICT.TODO_PRIORITY_低, '低'],
    [TODO_PRIORITY_DICT.TODO_PRIORITY_中, '中'],
    [TODO_PRIORITY_DICT.TODO_PRIORITY_高, '高'],
]
