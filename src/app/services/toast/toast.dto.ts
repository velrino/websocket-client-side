export enum ToastType {
    danger = 'bg-danger text-white',
    info = 'bg-info text-white',
    success = 'bg-success text-white',
}

export interface IToast {
    text: string;
    type: ToastType;
    delay: number;
}