import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { useTransactionFee } from '@/accounts/hooks/useTransactionFee'
import { useApi } from '@/api/hooks/useApi'
import { ButtonPrimary, ButtonsGroup } from '@/common/components/buttons'
import { DownloadButtonGhost } from '@/common/components/buttons/DownloadButtons'
import { Modal, ModalHeader, ModalTransactionFooter } from '@/common/components/Modal'
import { Stepper, StepperModalBody, StepperModalWrapper } from '@/common/components/StepperModal'
import { TextMedium } from '@/common/components/typography'
import { useMachine } from '@/common/hooks/useMachine'
import { useModal } from '@/common/hooks/useModal'
import { SignTransactionModal } from '@/common/modals/SignTransactionModal/SignTransactionModal'
import { isLastStepActive } from '@/common/modals/utils'
import { getSteps } from '@/common/model/machines/getSteps'
import { useYupValidationResolver } from '@/common/utils/validation'
import { machineStateConverter } from '@/council/modals/AnnounceCandidacy/helpers'
import { useMyMemberships } from '@/memberships/hooks/useMyMemberships'
import { StyledStepperBody } from '@/proposals/modals/AddNewProposal'

import { SuccessModal, CreateOpeningSteps as Steps, ImportOpening } from './components'
import { createOpeningMachine, CreateOpeningMachineState } from './machine'
import { OpeningConditions, CreateOpeningForm, CreateOpeningModalCall, OpeningSchema, defaultValues } from './types'
import { getTxParams } from './utils'

export const CreateOpeningModal = () => {
  const [showImport, setShowImport] = useState<boolean>(false)

  const { api } = useApi()
  const { active: activeMember } = useMyMemberships()
  const [state, send, service] = useMachine(createOpeningMachine)
  const { hideModal, modalData } = useModal<CreateOpeningModalCall>()

  const { group } = modalData
  const workingGroupConsts = api?.consts[group]

  const context = {
    group,
    minUnstakingPeriodLimit: workingGroupConsts?.minUnstakingPeriodLimit,
    minimumApplicationStake: workingGroupConsts?.minimumApplicationStake,
  } as OpeningConditions
  const path = useMemo(() => machineStateConverter(state.value), [state.value])
  const resolver = useYupValidationResolver<CreateOpeningForm>(OpeningSchema, path)
  const form = useForm<CreateOpeningForm>({ resolver, mode: 'onChange', defaultValues, context })
  useEffect(() => {
    form.trigger(machineStateConverter(state.value) as keyof CreateOpeningForm)
  }, [machineStateConverter(state.value)])

  const { transaction, feeInfo } = useTransactionFee(
    activeMember?.controllerAccount,
    () => {
      if (api && group) {
        const { ...specifics } = form.getValues() as CreateOpeningForm
        const { description, stakePolicy, rewardPerBlock } = getTxParams(group, specifics)
        return api.tx[group].addOpening(description, 'Regular', stakePolicy, String(rewardPerBlock))
      }
    },
    [api?.isConnected, activeMember?.id, group, form.formState.isValidating]
  )
  const exportedJsonValue = useMemo(() => {
    const { ...specifics } = form.getValues() as CreateOpeningForm
    const exportValue = {
      applicationDetails: specifics.durationAndProcess.details,
      title: specifics.workingGroupAndDescription.title,
      shortDescription: specifics.workingGroupAndDescription.shortDescription,
      description: specifics.workingGroupAndDescription.description,
      applicationFormQuestions: specifics.applicationForm?.questions?.map((question) => {
        return { question: question.questionField }
      }),
      stakingPolicy: {
        amount: specifics.stakingPolicyAndReward.stakingAmount?.toNumber(),
        unstakingPeriod: specifics.stakingPolicyAndReward.leavingUnstakingPeriod,
      },
      rewardPerBlock: specifics.stakingPolicyAndReward.rewardPerBlock?.toNumber(),
      expectedEndingTimestamp: specifics?.durationAndProcess?.isLimited
        ? specifics.durationAndProcess?.duration
        : undefined,
    }
    return JSON.stringify(exportValue)
  }, [form.getValues()])

  const goToPrevious = useCallback(() => {
    send('BACK')
  }, [send])

  useEffect((): any => {
    if (state.matches('requirementsVerification')) {
      return feeInfo && send(feeInfo.canAfford ? 'NEXT' : 'FAIL')
    }
    if (state.matches('beforeTransaction')) {
      return feeInfo?.canAfford ? send('NEXT') : send('FAIL')
    }
  }, [state, activeMember?.id, feeInfo])

  if (!activeMember || state.matches('requirementsFailed')) {
    return null
  }

  if (state.matches('transaction') && transaction && group) {
    return (
      <SignTransactionModal
        buttonText="Sign transaction and Create"
        transaction={transaction}
        signer={activeMember.controllerAccount}
        service={state.children.transaction}
      >
        <TextMedium>You intend to create an Opening.</TextMedium>
      </SignTransactionModal>
    )
  }

  if (state.matches('success') && group) {
    return <SuccessModal groupId={group} onClose={hideModal} />
  }

  return (
    <Modal onClose={hideModal} modalSize="m" modalHeight="xl">
      <ModalHeader title="Create Opening" onClick={hideModal} />

      <StepperModalBody>
        <StepperOpeningWrapper>
          <Stepper steps={getSteps(service)} />
          <StyledStepperBody>
            <FormProvider {...form}>
              {showImport ? (
                <ImportOpening groupId={group} />
              ) : (
                <Steps matches={state.matches as CreateOpeningMachineState['matches']} groupId={group} />
              )}
            </FormProvider>
          </StyledStepperBody>
        </StepperOpeningWrapper>
      </StepperModalBody>

      <ModalTransactionFooter
        prev={{ disabled: state.matches('workingGroupAndDescription'), onClick: goToPrevious }}
        next={{
          disabled: !form.formState.isValid || showImport,
          label: isLastStepActive(getSteps(service)) ? 'Create Opening' : 'Next step',
          onClick: () => send('NEXT'),
        }}
        extraButtons={
          <ButtonsGroup align="left">
            <ButtonPrimary
              size="medium"
              onClick={() => setShowImport(!showImport)}
              disabled={showImport && !form.formState.isValid}
            >
              {showImport ? 'Preview Import' : 'Import'}
            </ButtonPrimary>
            {isLastStepActive(getSteps(service)) && (
              <DownloadButtonGhost size="medium" name={'opening.json'} content={exportedJsonValue}>
                Export
              </DownloadButtonGhost>
            )}
          </ButtonsGroup>
        }
      />
    </Modal>
  )
}

export const StepperOpeningWrapper = styled(StepperModalWrapper)`
  grid-template-columns: 220px 1fr;
`
