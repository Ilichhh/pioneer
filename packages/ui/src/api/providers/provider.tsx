import React, { ReactNode, useEffect, useState } from 'react'
import { firstValueFrom } from 'rxjs'

import { Api } from '@/api'
import { useApiBenchmarking } from '@/api/hooks/useApiBenchmarking'

import { useNetworkEndpoints } from '../../common/hooks/useNetworkEndpoints'

import { ApiContext } from './context'

interface Props {
  children: ReactNode
}

type ConnectionState = 'connecting' | 'connected' | 'disconnected'

interface BaseAPI {
  api?: Api
  isConnected: boolean
  connectionState: ConnectionState
}

interface APIConnecting extends BaseAPI {
  api: undefined
  isConnected: false
  connectionState: 'connecting'
}

interface APIConnected extends BaseAPI {
  api: Api
  isConnected: true
  connectionState: 'connected'
}

interface APIDisconnected extends BaseAPI {
  api: Api
  isConnected: false
  connectionState: 'disconnected'
}

export type UseApi = APIConnecting | APIConnected | APIDisconnected

const stringifyConsts = (consts: Api['consts'], ...modules: (keyof Api['consts'])[]) =>
  modules.flatMap((module) => [
    `\n${module}:\n`,
    ...Object.entries(consts[module]).flatMap(([key, value]) => [key, ':', value.toHuman(), '\n']),
  ])

export const ApiContextProvider = ({ children }: Props) => {
  const [api, setApi] = useState<Api>()
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting')
  const [endpoints] = useNetworkEndpoints()

  useApiBenchmarking(api)

  useEffect(() => {
    firstValueFrom(Api.create(endpoints.nodeRpcEndpoint)).then((api) => {
      setApi(api)
      setConnectionState('connected')
      api.on('connected', () => setConnectionState('connected'))
      api.on('disconnected', () => setConnectionState('disconnected'))
      // eslint-disable-next-line no-console
      console.log(...stringifyConsts(api.consts, 'council', 'referendum'))
    })
  }, [])

  if (connectionState === 'connecting') {
    return (
      <ApiContext.Provider
        value={{
          isConnected: false,
          api: undefined,
          connectionState,
        }}
      >
        {children}
      </ApiContext.Provider>
    )
  }

  if (connectionState === 'connected') {
    return (
      <ApiContext.Provider
        value={{
          isConnected: true,
          api: api as Api,
          connectionState,
        }}
      >
        {children}
      </ApiContext.Provider>
    )
  }

  if (connectionState === 'disconnected') {
    return (
      <ApiContext.Provider
        value={{
          isConnected: false,
          api: api as Api,
          connectionState,
        }}
      >
        {children}
      </ApiContext.Provider>
    )
  }

  return null
}
