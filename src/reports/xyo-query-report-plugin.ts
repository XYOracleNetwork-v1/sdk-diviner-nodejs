import { IXyoPlugin, IXyoPluginDelegate } from '@xyo-network/sdk-base-nodejs'
import {
  IXyoQueryReportRepository,
  IXyoQueryInfo
} from './xyo-query-report-repository'
import { XyoQuery } from '../query/xyo-query'
import { XyoSha256 } from '@xyo-network/sdk-core-nodejs'
import { XyoQueryReportEndpoint } from './xyo-query-report-endpoint'

class XyoQueryReportPlugin implements IXyoPlugin {
  public getName(): string {
    return 'query-report'
  }

  public getProvides(): string[] {
    return []
  }
  public getPluginDependencies(): string[] {
    return ['REPORT_REPOSITORY']
  }
  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const repository = delegate.deps
      .REPORT_REPOSITORY as IXyoQueryReportRepository
    const query = delegate.deps.QUERY as XyoQuery
    const hasher = new XyoSha256()

    delegate.graphql.addType(XyoQueryReportEndpoint.type)
    delegate.graphql.addQuery(XyoQueryReportEndpoint.query)
    delegate.graphql.addResolver(
      XyoQueryReportEndpoint.queryName,
      new XyoQueryReportEndpoint(repository)
    )

    query.auth.alwaysAuth.push((queryConfig, price) => {
      const queryCopy = JSON.parse(JSON.stringify(queryConfig))
      queryCopy.payment = undefined

      let spender = 'unknown'
      if (queryConfig.payment && queryConfig.payment.apiKey) {
        spender = queryConfig.payment.apiKey
      }

      const hashesSpender = hasher
        .hash(
          Buffer.from(
            `NadffhkkiU3hGRVGWk50${spender}fhVq38XiNjfbmKkTlI2J`,
            'utf8'
          )
        )
        .getValue()
        .getContentsCopy()
        .toString('base64')

      const info: IXyoQueryInfo = {
        price,
        spender: hashesSpender,
        time: new Date(),
        query: queryCopy
      }

      repository.putQueryInfo(info)
    })

    return true
  }
}

export = new XyoQueryReportPlugin()
