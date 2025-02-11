import { FecthRequestModel } from "../../models/request.model"

export class ConditionPaymentService {

  private textUrl: string = 'conditionPayment'

  public static instance: ConditionPaymentService

  private request: FecthRequestModel

  constructor() {
    this.request = FecthRequestModel.getInstance()
  }

  public static getInstance() {
    if (!ConditionPaymentService.instance) {
      ConditionPaymentService.instance = new ConditionPaymentService()
    }
    return ConditionPaymentService.instance
  }

  async getAllConditionsPayments(token: string) {
    const response = await this.request.get(this.textUrl , token);
    return response
  }

}
