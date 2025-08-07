<script setup lang="ts">
import { throttle } from 'lodash-es'
import {
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NColorPicker,
  NSlider,
  NSwitch,
  NSelect,
} from 'naive-ui'

import { HintHelp } from '@/components'
import { useConfigureStore } from '@/stores/configure'

import type { ConfigureOptions } from '@/stores/configure'

const configureStore = useConfigureStore()

const modifyWatermarkColor = throttle((color: string) => {
  configureStore.modify({
    watermarkOptions: {
      fontColor: color,
    },
  })
}, 100)

const updateWatermarkOptions = <K extends keyof ConfigureOptions['watermarkOptions']>(
  key: K,
  value: ConfigureOptions['watermarkOptions'][K],
) => {
  configureStore.modify({
    watermarkOptions: {
      [key]: value,
    },
  })
}
</script>
<template>
  <NForm
    :label-width="80"
    :model="configureStore.configure.watermarkOptions"
    :show-feedback="false"
    class="space-y-4"
  >
    <NFormItem
      label="水印内容"
      path="content"
    >
      <NInput
        type="textarea"
        v-model:value="configureStore.configure.watermarkOptions.content"
        clearable
        @update:value="(value) => updateWatermarkOptions('content', value)"
      />
    </NFormItem>

    <div class="flex gap-x-4">
      <NFormItem
        label="字体大小"
        path="fontSize"
        class="w-full"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.fontSize"
          :min="8"
          :max="32"
          @update:value="(value) => updateWatermarkOptions('fontSize', value ?? 0)"
        />
      </NFormItem>
      <NFormItem
        label="文字颜色"
        path="fontColor"
        class="w-full"
      >
        <NColorPicker
          :default-value="configureStore.configure.watermarkOptions.fontColor"
          @update-value="
            (value) => {
              modifyWatermarkColor(value)
            }
          "
        />
      </NFormItem>
      <NFormItem
        label="字体风格"
        path="fontStyle"
        class="w-full"
      >
        <NSelect
          v-model:value="configureStore.configure.watermarkOptions.fontStyle"
          :options="[
            { label: '正常', value: 'normal' },
            { label: '斜体', value: 'italic' },
            { label: '倾斜', value: 'oblique' },
          ]"
          @update:value="(value) => updateWatermarkOptions('fontStyle', value)"
        />
      </NFormItem>
    </div>

    <div class="flex gap-x-4">
      <NFormItem
        label="行高"
        path="lineHeight"
        class="w-full"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.lineHeight"
          :min="1"
        />
      </NFormItem>
      <NFormItem
        label="字重"
        path="fontWeight"
        class="w-full"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.fontWeight"
          :min="100"
          :max="900"
          :step="100"
          @update:value="(value) => updateWatermarkOptions('fontWeight', value ?? 0)"
        />
      </NFormItem>
    </div>
    <div class="flex gap-x-4">
      <NFormItem
        label="宽度"
        path="width"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.width"
          class="w-full"
          :min="1"
          @update:value="(value) => updateWatermarkOptions('width', value ?? 0)"
        />
      </NFormItem>
      <NFormItem
        label="高度"
        path="height"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.height"
          class="w-full"
          :min="1"
          @update:value="(value) => updateWatermarkOptions('height', value ?? 0)"
        />
      </NFormItem>
    </div>

    <div class="flex gap-x-4">
      <NFormItem
        label="X轴间隔"
        path="xGap"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.xGap"
          class="w-full"
          @update:value="(value) => updateWatermarkOptions('xGap', value ?? 0)"
        />
      </NFormItem>
      <NFormItem
        label="Y轴间隔"
        path="yGap"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.yGap"
          class="w-full"
          @update:value="(value) => updateWatermarkOptions('yGap', value ?? 0)"
        />
      </NFormItem>
    </div>
    <div class="flex gap-x-4">
      <NFormItem
        label="X轴偏移"
        path="xoffset"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.xOffset"
          class="w-full"
          @update:value="(value) => updateWatermarkOptions('xOffset', value ?? 0)"
        />
      </NFormItem>
      <NFormItem
        label="Y轴偏移"
        path="yGap"
      >
        <NInputNumber
          v-model:value="configureStore.configure.watermarkOptions.yOffset"
          class="w-full"
          @update:value="(value) => updateWatermarkOptions('yOffset', value ?? 0)"
        />
      </NFormItem>
    </div>
    <div class="flex gap-x-4">
      <NFormItem
        label="旋转角度"
        path="rotate"
        class="w-full"
      >
        <NSlider
          v-model:value="configureStore.configure.watermarkOptions.rotate"
          :min="-90"
          :max="90"
          @update:value="(value) => updateWatermarkOptions('rotate', value ?? 0)"
        />
      </NFormItem>
      <NFormItem
        label="整体旋转"
        path="globalRotate"
        class="w-full"
      >
        <NSlider
          v-model:value="configureStore.configure.watermarkOptions.globalRotate"
          :min="-180"
          :max="180"
          @update:value="(value) => updateWatermarkOptions('globalRotate', value ?? 0)"
        />
      </NFormItem>
      <NFormItem
        label="跨越边界"
        path="cross"
        class="w-full"
      >
        <NSwitch
          v-model:value="configureStore.configure.watermarkOptions.cross"
          @update:value="(value) => updateWatermarkOptions('cross', value)"
        />
      </NFormItem>
    </div>
    <NFormItem
      label="图像地址"
      path="image"
    >
      <NInput
        type="textarea"
        v-model:value="configureStore.configure.watermarkOptions.image"
        clearable
      />
    </NFormItem>

    <div class="flex gap-x-4">
      <NFormItem
        path="imageWidth"
        class="w-full"
        :show-label="false"
      >
        <div>
          <HintHelp
            label="图像宽度"
            content="修改后需重新打开水印"
            class="pb-1.5"
          />
          <NInputNumber
            v-model:value="configureStore.configure.watermarkOptions.imageWidth"
            @update:value="(value) => updateWatermarkOptions('imageWidth', value ?? 0)"
          />
        </div>
      </NFormItem>
      <NFormItem
        path="imageHeight"
        class="w-full"
        :show-label="false"
      >
        <div>
          <HintHelp
            label="图像高度"
            content="修改后需重新打开水印"
            class="pb-1.5"
          />
          <NInputNumber
            v-model:value="configureStore.configure.watermarkOptions.imageHeight"
            @update:value="(value) => updateWatermarkOptions('imageHeight', value ?? 0)"
          />
        </div>
      </NFormItem>

      <NFormItem
        path="imageOpacity"
        class="w-full"
        :show-label="false"
      >
        <div class="flex h-full flex-col">
          <HintHelp
            label="图像透明度"
            content="修改后需重新打开水印"
            class="pb-1.5"
          />
          <NSlider
            v-model:value="configureStore.configure.watermarkOptions.imageOpacity"
            :min="0"
            :max="1"
            :step="0.01"
            class="mt-2"
            @update:value="(value) => updateWatermarkOptions('imageOpacity', value ?? 0)"
          />
        </div>
      </NFormItem>
    </div>
  </NForm>
</template>
