import React from 'react'
import { useParams } from 'react-router-dom'

import { PageLayout } from '@/app/components/PageLayout'
import { Loading } from '@/common/components/Loading'
import { nameMapping } from '@/common/helpers'
import { useWorkingGroup } from '@/working-groups/hooks/useWorkingGroup'
import { urlParamToWorkingGroupId } from '@/working-groups/model/workingGroupName'

import { AboutTab, AboutTabSidebar } from './AboutTab'
import { WorkingGroupPageHeader } from './components/WorkingGroupPageHeader'

export const WorkingGroup = () => {
  const { name } = useParams<{ name: string }>()
  const { isLoading, group } = useWorkingGroup({ name: urlParamToWorkingGroupId(name) })

  return (
    <PageLayout
      header={<WorkingGroupPageHeader group={group} />}
      main={isLoading || !group ? <Loading /> : <AboutTab workingGroup={group} />}
      sidebar={!isLoading && group && <AboutTabSidebar workingGroup={group} />}
      sidebarScrollable
      lastBreadcrumb={nameMapping(group?.name ?? name)}
    />
  )
}
