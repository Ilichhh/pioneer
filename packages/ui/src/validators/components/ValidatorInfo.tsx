import { Identicon } from '@polkadot/react-identicon'
import React from 'react'
import styled from 'styled-components'

import { CopyComponent } from '@/common/components/CopyComponent'
import { DiscordIcon, TelegramIcon, TwitterIcon } from '@/common/components/icons/socials'
import { DefaultTooltip, Tooltip } from '@/common/components/Tooltip'
import { BorderRad, Colors, Transitions } from '@/common/constants'
import { shortenAddress } from '@/common/model/formatters'
import { Address } from '@/common/types'
import { MemberIcons } from '@/memberships/components'
import { Avatar } from '@/memberships/components/Avatar'
import { MemberWithDetails } from '@/memberships/types'

interface ValidatorInfoProps {
  address: Address
  member?: MemberWithDetails
  size?: 's' | 'l'
}

export const ValidatorInfo = React.memo(({ address, member, size = 's' }: ValidatorInfoProps) => {
  const twitter = member?.externalResources?.find(({ source }) => source === 'TWITTER')
  const telegram = member?.externalResources?.find(({ source }) => source === 'TELEGRAM')
  const discord = member?.externalResources?.find(({ source }) => source === 'DISCORD')

  return (
    <ValidatorInfoWrap size={size}>
      <PhotoWrapper>
        <AccountPhoto size={size}>
          {member ? (
            <Avatar avatarUri={member.avatar} />
          ) : (
            <Identicon size={size === 'l' ? 80 : 40} theme={'beachball'} value={address} />
          )}
        </AccountPhoto>
      </PhotoWrapper>
      <ValidatorHandle className="accountName" size={size}>
        {member?.handle ?? 'Unknown'}
        {(twitter || telegram || discord) && (
          <MemberIcons>
            {twitter && (
              <Tooltip tooltipText={twitter.value}>
                <SocialTooltip>
                  <TwitterIcon />
                </SocialTooltip>
              </Tooltip>
            )}
            {telegram && (
              <Tooltip tooltipText={telegram.value}>
                <SocialTooltip>
                  <TelegramIcon />
                </SocialTooltip>
              </Tooltip>
            )}
            {discord && (
              <Tooltip tooltipText={discord.value}>
                <SocialTooltip>
                  <DiscordIcon />
                </SocialTooltip>
              </Tooltip>
            )}
          </MemberIcons>
        )}
      </ValidatorHandle>
      <AccountCopyAddress altText={shortenAddress(address)} copyText={address} />
    </ValidatorInfoWrap>
  )
})

const ValidatorInfoWrap = styled.div<{ size?: 's' | 'l' }>`
  display: grid;
  grid-template-columns: ${({ size }) => (size === 'l' ? '80px' : '40px')} 1fr;
  grid-column-gap: 12px;
  grid-template-areas:
    'accountphoto accountname'
    'accountphoto accountaddress';
  align-items: center;
  width: 100%;
  justify-self: start;
`

const AccountPhoto = styled.div<{ size?: 's' | 'l' }>`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  align-content: center;
  align-self: center;
  height: ${({ size }) => (size === 'l' ? '80px' : '40px')};
  width: ${({ size }) => (size === 'l' ? '80px' : '40px')};
  border-radius: ${BorderRad.full};
  overflow: hidden;
`

const PhotoWrapper = styled.div`
  grid-area: accountphoto;
  position: relative;
`

const ValidatorHandle = styled.h5<{ size?: 's' | 'l' }>`
  grid-area: accountname;
  max-width: 100%;
  margin: 0;
  padding: 0;
  font-size: ${({ size }) => (size === 'l' ? '20px' : '16px')};
  line-height: 24px;
  font-weight: 700;
  color: ${Colors.Black[900]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
  transition: ${Transitions.all};
  display: grid;
  grid-auto-flow: column;
  grid-column-gap: 4px;
  align-items: center;
  width: fit-content;
  margin-top: auto;
`

const AccountCopyAddress = styled(CopyComponent)`
  grid-area: accountaddress;
  margin-bottom: auto;
`
const SocialTooltip = styled(DefaultTooltip)`
  > svg {
    width: 8px;
    height; 8px;
    cursor: pointer;
    path {
      fill: ${Colors.Black[900]};
    }
  }
  &:hover {
    border-color: ${Colors.Blue[300]} !important;
    background: transparent !important;
    path {
      fill: ${Colors.Blue[500]};
    }
  }
`
