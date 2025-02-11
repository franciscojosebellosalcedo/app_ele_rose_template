import { FecthRequestModel } from "../../models/request.model"

export class PaymentShapeService {

  private textUrl: string = 'paymentShape'

  public static instance: PaymentShapeService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!PaymentShapeService.instance) {
      PaymentShapeService.instance = new PaymentShapeService()
    }
    return PaymentShapeService.instance
  }

  async getAllPaymentsShapes(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
