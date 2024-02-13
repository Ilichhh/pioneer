import { linkTo } from '@storybook/addon-links'
import { Meta, StoryContext, StoryObj } from '@storybook/react'
import { FC } from 'react'

import { member } from '@/mocks/data/members'
import { joy } from '@/mocks/helpers'
import { MocksParameters } from '@/mocks/providers'
import { GetWorkersDocument, GetWorkingGroupDocument, GetBudgetSpendingDocument } from '@/working-groups/queries'

import { WorkingGroup } from './WorkingGroup'

type Args = {
  isLead: boolean
  onCreateOpening: jest.Mock
}

type Story = StoryObj<FC<Args>>

const WG_DATA = {
  id: 'membershipWorkingGroup',
  name: 'membership',
}

export default {
  title: 'Pages/Working Group/WorkingGroup',
  component: WorkingGroup,

  args: {
    isLead: true,
  },

  parameters: {
    router: {
      path: '/working-groups/:name',
      href: `/working-groups/${WG_DATA.name}`,
      actions: {
        '/working-groups/:name/history': linkTo('Pages/Working Group/WorkingGroupHistory'),
        '/working-groups/:name/openings': linkTo('Pages/Working Group/WorkingGroupOpenings'),
      },
    },
    mocks: ({ args }: StoryContext<Args>): MocksParameters => {
      const alice = member('alice', {
        roles: [
          {
            __typename: 'Worker',
            id: `${WG_DATA.id}-0`,
            createdAt: '2021',
            isLead: args.isLead,
            isActive: true,
            group: {
              __typename: 'WorkingGroup',
              name: WG_DATA.name,
            },
          },
        ],
      })
      return {
        accounts: { active: { member: alice } },

        gql: {
          queries: [
            {
              query: GetWorkingGroupDocument,
              data: {
                workingGroupByUniqueInput: {
                  id: WG_DATA.id,
                  name: WG_DATA.name,
                  budget: joy(200),
                  workers: [],
                  leader: { membershipId: alice.id, isActive: args.isLead },
                },
              },
            },
            {
              query: GetWorkersDocument,
              data: {
                workers: [
                  {
                    id: `${WG_DATA.id}-0`,
                    group: {
                      id: WG_DATA.id,
                      name: WG_DATA.name,
                    },
                    status: 'WorkerStatusActive',
                    membership: alice,
                  },
                  {
                    id: `${WG_DATA.id}-1`,
                    group: {
                      id: WG_DATA.id,
                      name: WG_DATA.name,
                    },
                    status: 'WorkerStatusActive',
                    membership: member('charlie'),
                  },
                ],
              },
            },
            {
              query: GetBudgetSpendingDocument,
              data: {
                budgetSpendingEvents: [
                  {
                    id: 1,
                    groupId: WG_DATA.id,
                    reciever: '',
                    amount: joy(100),
                    rationale: 'first spending',
                  },
                  {
                    id: 2,
                    groupId: WG_DATA.id,
                    reciever: '',
                    amount: joy(42),
                    rationale: 'second spending',
                  },
                ],
              },
            },
          ],
        },
      }
    },
  },
} satisfies Meta<Args>

export const Default: Story = {}
