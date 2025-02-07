import React from 'react'
import { useParams } from 'react-router-dom'

import { PageLayout } from '@/app/components/PageLayout'
import { Loading } from '@/common/components/Loading'
import { useWorkingGroup } from '@/working-groups/hooks/useWorkingGroup'
import { urlParamToWorkingGroupId } from '@/working-groups/model/workingGroupName'

import { WorkingGroupPageHeader } from './components/WorkingGroupPageHeader'
import { HistoryTab, HistoryTabSidebar } from './HistoryTab'

export function WorkingGroupHistory() {
  const { name } = useParams<{ name: string }>()
  const { isLoading, group } = useWorkingGroup({ name: urlParamToWorkingGroupId(name) })

  return (
    <PageLayout
      header={<WorkingGroupPageHeader group={group} />}
      main={isLoading || !group ? <Loading /> : <HistoryTab workingGroup={group} />}
      sidebar={!isLoading && group && <HistoryTabSidebar workingGroup={group} />}
      sidebarScrollable
      lastBreadcrumb="History"
    />
  )
}
