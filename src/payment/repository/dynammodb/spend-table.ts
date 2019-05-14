
import { Table } from './table'
import { DynamoDB } from 'aws-sdk'

export class SpendTable extends Table {

  constructor(
      tableName: string = 'xyo-diviner-spent',
      region: string = 'us-east-1'
    ) {
    super(tableName, region)

    this.createTableInput = {
      AttributeDefinitions: [
        {
          AttributeName: 'SpendKey',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'SpendKey',
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

  public async putItem (key: string): Promise<void> {
    return new Promise<void>((resolve: any, reject: any) => {
      try {
        const params: DynamoDB.Types.PutItemInput = {
          Item: {
            SpendKey: {
              S: key
            },
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

  public async getItem (key: string): Promise<any> {
    return new Promise<boolean>((resolve: any, reject: any) => {
      try {
        const params: DynamoDB.Types.GetItemInput = {
          Key: {
            SpendKey: {
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

          if (data && data.Item) {
            const result = data.Item.SpendKey.S
            resolve(result)
            return
          }
          resolve()
        })
      } catch (ex) {
        this.logError(ex)
        reject(ex)
      }
    })
  }
}
