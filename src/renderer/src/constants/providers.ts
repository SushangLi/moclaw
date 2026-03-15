export type Provider = 'momoai'
export type AuthMethod = 'api-key' | 'oauth'

export interface ModelOption {
  id: string
  name: string
  desc: string
  price?: string
}

export interface ProviderConfig {
  id: Provider
  label: string
  placeholder: string
  pattern: RegExp
  models: ModelOption[]
  oauthModels?: ModelOption[]
  authMethods?: AuthMethod[]
}

export const providerConfigs: ProviderConfig[] = [
  {
    id: 'momoai',
    label: 'MomoAI',
    placeholder: 'momo_xxxxx',
    pattern: /^momo_/,
    models: [
      {
        id: 'momo_222',
        name: '花满楼的Qwen3.5 Plus',
        desc: 'Qwen 3.5 Plus',
        price: '0.4 CNY / M tokens'
      },
      {
        id: 'momo_223',
        name: '花满楼的Deepseek V3.2',
        desc: 'Deepseek V3.2',
        price: '2.0 CNY / M tokens'
      },
      {
        id: 'momo_221',
        name: '花满楼的GLM-5',
        desc: 'GLM-5',
        price: '3.5 CNY / M tokens'
      },
      {
        id: 'momo_220',
        name: '花满楼的Minimax M2.5',
        desc: 'Minimax M2.5',
        price: '2.0 CNY / M tokens'
      },
      {
        id: 'momo_219',
        name: '花满楼的kimi-k2.5',
        desc: 'Kimi K2.5',
        price: '5.0 CNY / M tokens'
      }
    ]
  }
]
