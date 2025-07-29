<script setup lang="tsx">
import {
  NButton,
  NDataTable,
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NPopconfirm,
  useMessage,
  useModal,
  NPagination,
  NButtonGroup,
  NDropdown,
  NTag,
  NNumberAnimation,
  NAlert,
} from 'naive-ui'
import { defineComponent, reactive, ref, useTemplateRef, nextTick } from 'vue'

import { useComponentModifier } from '@/composable/comp/useComponentModifier'
import { useDataTable } from '@/composable/comp/useDataTable'
import { useResettableReactive } from '@/composable/useResettable'

import ModalData from './ModalData.vue'

import type { DataTableColumns, PaginationProps, FormRules, DropdownProps } from 'naive-ui'
import type { PropType } from 'vue'

export interface UserInfo {
  address: string
  age: number | null
  company: string
  email: string
  fullName: string
  number: number
  id: number | string
  phone: string
  registerDate: null | null
  sex: string | null
  children: UserInfo[]
}

interface UserForm extends Partial<UserInfo> {}

defineComponent({
  name: 'DataTable',
})

const formRef = useTemplateRef<InstanceType<typeof NForm>>('formRef')

const dataTableRef = useTemplateRef<InstanceType<typeof NDataTable>>('dataTableRef')

const { maxHeight, updateMaxHeight } = useDataTable(dataTableRef)

const message = useMessage()

const modal = useModal()

const { getPopconfirmModifier } = useComponentModifier()

const [form, , resetForm] = useResettableReactive<UserForm>({
  fullName: '',
  sex: null,
  phone: '',
  company: '',
})

const rules: FormRules = {
  sex: {
    required: true,
    message: '请选择性别',
  },
}

const sexOptions = [
  { label: '男', value: '男' },
  { label: '女', value: '女' },
]

const loading = ref(false)
const striped = ref(false)
const scrollX = ref(true)
const singleLine = ref(true)
const showDropdown = ref(false)
const enableContextmenu = ref(true)
const contextmenuId = ref<number | string | null>(null)

const userList = ref<UserInfo[]>([])

const checkedRowKeys = ref<Array<number | string>>([])

const CellActions = (row: UserInfo) => (
  <div class='flex gap-2'>
    <NButton
      secondary
      type='primary'
      size='small'
      onClick={() => createOrEditUser(row)}
    >
      编辑
    </NButton>
    <NPopconfirm
      {...getPopconfirmModifier()}
      positiveText='确定'
      negativeText='取消'
      onPositiveClick={() => {
        message.success('点击了删除')
      }}
    >
      {{
        default: () => '确认删除吗？',
        trigger: () => (
          <NButton
            secondary
            type='error'
            size='small'
          >
            删除
          </NButton>
        ),
      }}
    </NPopconfirm>
  </div>
)

const ShowOrEdit = defineComponent({
  name: 'ShowOrEdit',
  props: {
    value: {
      type: String,
      required: true,
    },
    onUpdateValue: {
      type: Function as PropType<(value: string) => void>,
    },
  },
  setup(props) {
    const isEdit = ref(false)
    const inputRef = ref<InstanceType<typeof NInput> | null>(null)
    const inputValue = ref(props.value)

    function handleOnClick() {
      isEdit.value = true
      nextTick(() => {
        inputRef.value?.focus()
      })
    }

    function handleChange() {
      if (!inputValue.value.trim()) {
        message.error('为空就再也编辑不了了')
        inputValue.value = props.value
      }
      isEdit.value = false
      props.onUpdateValue?.(inputValue.value)
    }

    return () => (
      <div onClick={handleOnClick}>
        {isEdit.value ? (
          <NInput
            ref={inputRef}
            value={inputValue.value}
            clearable
            onUpdateValue={(value) => {
              inputValue.value = value
            }}
            onBlur={handleChange}
          />
        ) : (
          <span>{props.value}</span>
        )}
      </div>
    )
  },
})

const columns: DataTableColumns<UserInfo> = [
  {
    type: 'selection',
    options: [
      'all',
      'none',
      {
        label: '选中前 3 行可选数据',
        key: 'f2',
        onSelect: (pageData) => {
          checkedRowKeys.value = pageData
            .filter((row) => row.number < 500)
            .map((row) => row.id)
            .slice(0, 3)
        },
      },
    ],
    disabled: (row) => {
      return ['4', '5', '8', '9'].includes(String(row.number)[0])
    },
  },
  {
    key: 'number',
    title: '编号',
    width: 100,
  },
  {
    key: 'fullName',
    width: 160,
    title: () => {
      return (
        <div class='flex items-center gap-x-2'>
          <span>姓名</span>
          <span class='iconify ph--pencil-simple-line' />
        </div>
      )
    },
    render: (row, index) => (
      <ShowOrEdit
        value={row.fullName}
        onUpdateValue={(value) => {
          userList.value[index].fullName = value
        }}
      />
    ),
  },
  {
    key: 'sex',
    title: '性别',
    width: 100,
    render: (row) => {
      const isMale = row.sex === '男'
      return (
        <div>
          <span
            class={
              isMale
                ? 'iconify text-sky-500 ph--gender-male'
                : 'iconify text-pink-500 ph--gender-female'
            }
          />
        </div>
      )
    },
  },
  {
    key: 'age',
    title: '年龄',
    width: 100,
    render: (row) => {
      const age = row.age ?? 0

      return (
        <NTag
          bordered={false}
          size='small'
          type={age > 50 ? 'error' : age > 40 ? 'warning' : age > 30 ? 'info' : 'success'}
        >
          {row.age}
        </NTag>
      )
    },
  },
  {
    key: 'email',
    title: '邮箱',
  },
  {
    key: 'phone',
    title: '电话',
  },
  {
    key: 'address',
    title: '地址',
  },
  {
    key: 'company',
    title: '公司',
  },
  {
    key: 'registerDate',
    title: '注册日期',
  },
  {
    width: 140,
    key: 'actions',
    align: 'center',
    title: '操作',
    fixed: 'right',
    render: (row) => <CellActions {...row} />,
  },
]

function rowProps(row: UserInfo) {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault()
      showDropdown.value = false
      nextTick().then(() => {
        contextmenuId.value = row.number
        showDropdown.value = true
        dropdownOptions.x = e.clientX
        dropdownOptions.y = e.clientY
      })
    },
  }
}

const pagination = reactive<PaginationProps>({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
  itemCount: 0,
  showQuickJumper: true,
  showQuickJumpDropdown: true,
  onUpdatePage: (page: number) => {
    pagination.page = page
    getUserList()
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
    getUserList()
  },
})

const prevItemCount = ref(0)

const paginationPrefix: PaginationProps['prefix'] = (info) => {
  const { itemCount } = info
  return (
    itemCount && (
      <div>
        <span>总&nbsp;</span>
        <NNumberAnimation
          from={prevItemCount.value}
          to={itemCount}
          onFinish={() => {
            prevItemCount.value = itemCount
          }}
        />
        <span>&nbsp;条</span>
      </div>
    )
  )
}

const handleQueryClick = () => {
  formRef.value?.validate((errors) => {
    if (!errors) {
      getUserList()
    }
  })
}

const dropdownOptions = reactive<DropdownProps>({
  x: 0,
  y: 0,
  options: [
    {
      label: '编辑',
      key: 'edit',
    },
    {
      label: () => <span class='text-red-500'>删除</span>,
      key: 'delete',
    },
  ],
  onClickoutside: () => {
    showDropdown.value = false
  },
  onSelect: () => {
    message.info(`id: ${contextmenuId.value}`)
    showDropdown.value = false
  },
})

async function request(pageSize: number): Promise<{ data: UserInfo[]; total: number }> {
  return fetch(`http://43.143.155.96:3000/api/faker/v2/diy?num=${pageSize}`, {
    method: 'GET',
  }).then((res) => res.json())
}

function createOrEditUser(data?: UserInfo) {
  const title = data ? '编辑数据' : '新增数据'

  const handleSubmitClick = () => {
    message.success('点击了提交')
    m.destroy()
  }

  function handleUpdateClick() {
    message.info('点击了更新')
    m.destroy()
  }

  function handleCancelClick() {
    m.destroy()
  }

  const m = modal.create({
    title,
    preset: 'card',
    draggable: true,
    style: {
      width: '500px',
    },
    content: () => (
      <ModalData
        data={data || {}}
        onSubmit={handleSubmitClick}
        onUpdate={handleUpdateClick}
        onCancel={handleCancelClick}
      />
    ),
  })
}

function inputOnlyAllowNumber(value: string) {
  return !value || /^\d+$/.test(value)
}

function handleDownloadCsvClick() {
  if (!dataTableRef.value) return
  dataTableRef.value.downloadCsv()
}

async function getUserList() {
  loading.value = true
  const pageSize = pagination.pageSize || 10
  const res = await request(pageSize).finally(() => {
    loading.value = false
  })

  userList.value = res.data
  pagination.itemCount = 300
}

getUserList()
</script>
<template>
  <div class="main-wrap flex flex-col gap-y-2 p-4">
    <NAlert
      type="info"
      closable
      @after-leave="updateMaxHeight"
    >
      一个数据表格的例子，不算复杂，有一个高度的计算，也许对你有帮助
    </NAlert>
    <NCard>
      <div class="mb-2 flex gap-x-4">
        <NForm
          ref="formRef"
          :model="form"
          :rules="rules"
          inline
          label-placement="left"
        >
          <NFormItem
            label="姓名"
            path="fullName"
          >
            <NInput
              v-model:value="form.fullName"
              style="width: 120px"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="性别"
            path="sex"
          >
            <NSelect
              v-model:value="form.sex"
              :options="sexOptions"
              style="width: 88px"
              clearable
            />
          </NFormItem>
          <NFormItem
            label="联系方式"
            path="phone"
          >
            <NInput
              v-model:value="form.phone"
              clearable
              :allow-input="inputOnlyAllowNumber"
            />
          </NFormItem>
          <NFormItem
            label="公司"
            path="company"
          >
            <NInput
              v-model:value="form.company"
              clearable
            />
          </NFormItem>
        </NForm>
        <div class="flex gap-2">
          <NButton
            type="success"
            @click="createOrEditUser()"
          >
            <template #icon>
              <span class="iconify ph--plus-circle" />
            </template>
            新增数据
          </NButton>
          <NButton
            type="info"
            @click="handleQueryClick"
            :loading="loading"
            :disabled="loading"
          >
            <template #icon>
              <span class="iconify ph--magnifying-glass" />
            </template>
            查询
          </NButton>
          <NButton
            type="warning"
            @click="resetForm"
          >
            <template #icon>
              <span class="iconify ph--arrow-clockwise" />
            </template>
            重置
          </NButton>
        </div>
      </div>
      <div>
        <NDataTable
          ref="dataTableRef"
          v-model:checked-row-keys="checkedRowKeys"
          :remote="true"
          :max-height="maxHeight"
          :scroll-x="scrollX ? 1800 : 0"
          :min-height="166.6"
          :columns="columns"
          :data="userList"
          :row-key="(row) => row.id"
          :loading="loading"
          :striped="striped"
          :row-props="rowProps"
          :single-line="singleLine"
        />
        <div class="mt-3 flex items-end justify-between">
          <div class="flex items-center gap-x-3">
            <span>已选择&nbsp;{{ checkedRowKeys.length }}&nbsp; 条</span>
            <NButtonGroup
              size="small"
              :ghost="true"
            >
              <NButton
                @click="striped = !striped"
                :type="striped ? 'primary' : 'default'"
                secondary
              >
                条纹风格
              </NButton>
              <NButton
                @click="singleLine = !singleLine"
                :type="!singleLine ? 'primary' : 'default'"
                secondary
              >
                单线风格
              </NButton>
              <NButton
                @click="scrollX = !scrollX"
                :type="scrollX ? 'primary' : 'default'"
                secondary
              >
                横向滚动
              </NButton>

              <NButton
                @click="enableContextmenu = !enableContextmenu"
                :type="enableContextmenu ? 'primary' : 'default'"
                secondary
              >
                右键菜单
              </NButton>
              <NButton
                @click="handleDownloadCsvClick"
                secondary
                type="info"
              >
                下载为Csv
              </NButton>
            </NButtonGroup>
          </div>
          <NPagination
            v-bind="pagination"
            :prefix="paginationPrefix"
          />
        </div>
      </div>
    </NCard>
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      v-bind="dropdownOptions"
      :show="enableContextmenu && showDropdown"
    />
  </div>
</template>
