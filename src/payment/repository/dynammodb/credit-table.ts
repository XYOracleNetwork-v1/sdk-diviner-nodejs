
import { Table } from './table'
import { DynamoDB } from 'aws-sdk'

export class CreditTable extends Table {

  constructor(
      tableName: string = 'xyo-diviner-credits',
      region: string = 'us-east-1'
    ) {
    super(tableName, region)

    this.createTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: 'ApiKey',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'ApiKey',
          KeyType: 'HASH'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2
      },
      TableName: tableName
    }
  }

  public async putItem (key: string, bal: number): Promise<void> {
    return new Promise<void>((resolve: any, reject: any) => {
      try {
        const params: DynamoDB.Types.PutItemInput = {
          Item: {
            ApiKey: {
              S: key
            },
            Credits: {
              N: bal.toString()
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

  public async getBalance (key: string): Promise<number | undefined> {
    return new Promise<number | undefined>((resolve: any, reject: any) => {
      try {
        const params: DynamoDB.Types.GetItemInput = {
          Key: {
            ApiKey: {
              S: key
            }
          },
          ReturnConsumedCapacity: 'TOTAL',
          TableName: this.tableName
        }
        this.dynamodb.getItem(params, (err: any, data: DynamoDB.Types.GetItemOutput) => {
          if (err) {
            reject(err)
          }

          if (data.Item && data.Item.Credits.N) {
            resolve(parseFloat(data.Item.Credits.N))
          }
          resolve(undefined)
        })
      } catch (ex) {
        this.logError(ex)
        reject(ex)
      }
    })
  }
}
