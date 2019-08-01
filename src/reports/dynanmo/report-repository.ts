
import { Table } from './../../payment/repository/dynammodb/table'
import { DynamoDB } from 'aws-sdk'
import { IXyoQueryReportRepository, IXyoQueryInfo } from '../xyo-query-report-repository'

export class QueryReportTable extends Table implements IXyoQueryReportRepository {

  constructor(
      tableName: string = 'xyo-diviner-queries',
      region: string = 'us-east-1'
    ) {
    super(tableName, region)

    this.createTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: 'Day',
          AttributeType: 'N'
        },
        {
          AttributeName: 'Time',
          AttributeType: 'N'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'Day',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'Time',
          KeyType: 'RANGE'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      },
      TableName: tableName
    }
  }

  public putQueryInfo(info: IXyoQueryInfo): Promise<void> {
    const day = Math.floor(info.time.getTime() / (1000 * 60 * 60 * 24))

    return new Promise<void>((resolve: any, reject: any) => {
      try {
        const params: DynamoDB.Types.PutItemInput = {
          Item: {
            Day: {
              N: day.toString()
            },
            Time: {
              N: info.time.getTime().toString()
            },
            Price: {
              N: info.price.toString()
            },
            Query: {
              S: JSON.stringify(info.query)
            },
            Spender: {
              S: info.spender
            }
          },
          TableName: this.tableName
        }
        this.dynamodb.putItem(params, (err: any, data: DynamoDB.Types.PutItemOutput) => {
          if (err) {
            reject(err)
          }
          resolve()
        })
      } catch (ex) {
        this.logError(ex)
        reject(ex)
      }
    })
  }

  public getQueryInfo(day: number, time: number, limit: number): Promise<IXyoQueryInfo[]> {
    return new Promise<IXyoQueryInfo[]>((resolve: any, reject: any) => {
      try {
        const params: DynamoDB.Types.QueryInput = {
          Limit: limit,
          KeyConditionExpression: '#day = :day and #time < :time',
          ExpressionAttributeValues: {
            ':day': { N: day.toString() },
            ':time': { N: time.toString() }
          },
          ExpressionAttributeNames: {
            '#day': 'Day',
            '#time': 'Time'
          },
          ScanIndexForward: false,
          TableName: this.tableName,
        }

        this.dynamodb.query(params, async(err: any, data: DynamoDB.Types.ScanOutput) => {
          if (err) {
            this.logError(err)
            reject(err)
          }

          const result = []

          if (data && data.Items) {
            for (const item of data.Items) {

              result.push({
                spender: item.Spender.S,
                time: new Date(parseInt(item.Time.N || '0', 10)),
                price: parseInt(item.Price.N || '0', 10),
                query: item.Query.S,
              })

            }
          }
          resolve(result)
        })
      } catch (ex) {
        this.logError(ex)
        reject(ex)
      }
    })
  }

}
