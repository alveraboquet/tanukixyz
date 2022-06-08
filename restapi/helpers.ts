import { Response } from 'express';

export function removeIdFields(documents: Array<any>): Array<any> {
  const temp = documents;
  for (let i = 0; i < documents.length; i++) {
    delete temp[i]._id;
  }
  return temp;
}

export interface WriteResponseDataProps {
  status: number;
  data: any;
  removeIdField: boolean;
}
export function writeResponseData(response: Response, data: WriteResponseDataProps) {
  response.status(data.status).json({
    error: null,
    data: data.removeIdField ? removeIdFields(data.data) : data.data,
  });
}

export interface WriteResponseErrorProps {
  status: number;
  error: string;
}
export function writeResponseError(response: Response, data: WriteResponseErrorProps) {
  response.status(data.status).json({
    error: data.error,
    data: null,
  });
}
