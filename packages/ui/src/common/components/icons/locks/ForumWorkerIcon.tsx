import React from 'react'

import { Colors } from '@/common/constants'

import { Icon, StyledIcon } from '../Icon'

export const ForumWorkerIcon = React.memo(({ className }: StyledIcon) => (
  <Icon
    size="24"
    viewBox="0 0 24 24"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    color="currentColor"
    className={className}
  >
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 5H15V7H5V5Z" fill={Colors.Blue[500]} />
    <path fill-rule="evenodd" clip-rule="evenodd" d="M5 9H11V11H5V9Z" fill={Colors.Blue[500]} />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M15.3053 16.4971C15.3053 16.4971 15.3053 16.4971 15.3053 16.4971C15.3104 16.4948 15.3154 16.4924 15.3204 16.4901C15.3154 16.4924 15.3104 16.4948 15.3053 16.4971ZM20.1653 16.2502L19.8982 16.4615L20.2128 16.5918C21.2064 17.0034 21.9511 17.6742 22.4814 18.4461C23.3258 19.6753 23.6 21.1124 23.6 22.0531V22.5992L23.1115 22.8434C22.351 23.2237 20.3539 23.9 17.9 23.9C15.446 23.9 13.4489 23.2237 12.6884 22.8434L12.2 22.5992V22.0531C12.2 21.1124 12.4741 19.6753 13.3185 18.4461C13.8489 17.674 14.5938 17.0031 15.5877 16.5915L15.9024 16.4613L15.6354 16.2499C14.7895 15.5805 14.2474 14.5455 14.2474 13.3837C14.2474 11.3662 15.883 9.73065 17.9005 9.73065C19.918 9.73065 21.5536 11.3662 21.5536 13.3837C21.5536 14.5456 21.0113 15.5808 20.1653 16.2502ZM14.0365 21.3138L14.0068 21.4831L14.1697 21.538C14.983 21.8118 16.3235 22.1327 17.9 22.1327C19.4764 22.1327 20.8169 21.8118 21.6302 21.538L21.7931 21.4831L21.7634 21.3138C21.6611 20.7314 21.4354 20.0447 21.0247 19.4468C20.4561 18.6193 19.5167 17.9276 17.9 17.9276C16.2832 17.9276 15.3438 18.6193 14.7752 19.4468C14.3645 20.0447 14.1388 20.7314 14.0365 21.3138ZM17.9005 15.2694C18.9419 15.2694 19.7862 14.4252 19.7862 13.3837C19.7862 12.3423 18.9419 11.498 17.9005 11.498C16.859 11.498 16.0148 12.3423 16.0148 13.3837C16.0148 14.4252 16.859 15.2694 17.9005 15.2694Z"
      fill={Colors.Black[900]}
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M1.99998 1.09998H1.09998V13.5555V14.4555H4.65553V17.1111V18.5L11.1614 14.4555L15.3761 14.4555C15.1365 14.0245 15 13.5282 15 13C15 12.8835 15.0066 12.7686 15.0196 12.6555L10.8889 12.6555L6.45553 15.4294V13.5555V12.6555H2.89998V2.89998H17.1V10.1373C17.3841 10.0481 17.6864 10 18 10C18.3136 10 18.6159 10.0481 18.9 10.1373V1.09998H18H1.99998Z"
      fill={Colors.Black[900]}
    />
  </Icon>
))
