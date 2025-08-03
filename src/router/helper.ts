import { isArray, isEmpty, isString, pickBy, omit } from 'lodash-es'
import { h } from 'vue'
import { RouterLink } from 'vue-router'

import type { MenuProps, MenuDividerOption, MenuOption, MenuGroupOption } from 'naive-ui'
import type { RouteRecordRaw } from 'vue-router'

type NoIndex<T> = {
  [K in keyof T as string extends K ? never : K]: T[K]
}

type ReplaceKeys<T, R extends Partial<Record<keyof T, unknown>>> = T extends unknown
  ? {
      [K in keyof T]: K extends keyof R ? R[K] : T[K]
    } & Omit<R, keyof T>
  : never

type CustomRouteRecordRaw = ReplaceKeys<
  RouteRecordRaw,
  {
    component: string
  }
>

type RouteOption = Omit<CustomRouteRecordRaw, 'children'> & {
  type?: never
}

type MergeMenuOption = ReplaceKeys<
  MenuOption,
  {
    icon: string
    children?: MergeMenuMixedOptions[]
  }
> &
  RouteOption

type MergeMenuGroup = NoIndex<
  ReplaceKeys<
    MenuGroupOption,
    {
      children?: Array<MergeMenuOption | MergeMenuDivider>
    }
  >
>

type MergeMenuDivider = NoIndex<MenuDividerOption>

export type MergeMenuMixedOptions = MergeMenuOption | MergeMenuGroup | MergeMenuDivider

export function resolveMenu(options: MergeMenuMixedOptions[], parentDisabled = false) {
  const menuOption: MenuProps['options'] = []

  options.forEach((item) => {
    if (!item.type || item.type === 'group') {
      const { children, name, path, label, icon, key, disabled, extra, props, show, type } =
        item as MergeMenuOption & { label: string }

      const mergedDisabled = parentDisabled || disabled

      const createIcon = icon ? () => h('span', { class: `${icon} size-6` }) : null

      const menu = pickBy(
        {
          key: key || (name as string) || (path as string),
          icon: createIcon,
          label,
          disabled,
          extra,
          props,
          show,
          type,
        },
        (v) => v !== undefined,
      ) as NonNullable<MenuProps['options']>[number]

      if (isArray(children) && !isEmpty(children)) {
        menu.children = resolveMenu(children, mergedDisabled)
      } else {
        menu.label = mergedDisabled
          ? label
          : () => h(RouterLink, { to: { name: name as string } }, { default: () => label })
      }

      menuOption.push(menu)
    } else {
      menuOption.push(item)
    }
  })

  return menuOption
}

export function resolveRoute(options: MergeMenuMixedOptions[]) {
  const modules = import.meta.glob('@/views/**/*.vue')

  const routeOptions: RouteRecordRaw[] = []

  function flattenOptions(options: MergeMenuMixedOptions[]): MergeMenuMixedOptions[] {
    return options.flatMap((item) => {
      if (item.type === 'divider') {
        return []
      }

      if (item.type === 'group' && isArray(item.children) && !isEmpty(item.children)) {
        return flattenOptions(item.children)
      }

      return [item]
    })
  }

  flattenOptions(options).forEach((item) => {
    const { label, icon, meta, component, children, disabled, ...rest } =
      item as MergeMenuOption & {
        label: string
      }

    if (!disabled) {
      let compModule: (() => Promise<unknown>) | null = null

      if (!isEmpty(component) && isString(component)) {
        const extractName = component.replace(/^\/|\.vue$/g, '')
        const modulePath = `/src/views/${extractName}.vue`
        if (modules[modulePath]) {
          compModule = modules[modulePath]
        }
      }

      const route = omit(
        {
          ...rest,
          ...(compModule ? { component: compModule } : {}),
          meta: {
            ...meta,
            label: meta?.label || label,
            icon,
          },
        },
        ['type', 'label', 'icon', 'disabled', 'extra', 'props', 'show', 'key'],
      ) as RouteRecordRaw

      if (isArray(children) && !isEmpty(children)) {
        route.children = resolveRoute(children)
      }

      routeOptions.push(route)
    }
  })

  return routeOptions
}
