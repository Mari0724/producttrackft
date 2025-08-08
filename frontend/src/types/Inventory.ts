export interface InventoryChange {
  id: string;
  productName: string;
  action: 'added' | 'modified' | 'deleted';
  previousQuantity?: number;
  newQuantity?: number;
  previousPrice?: number;
  newPrice?: number;
  changeDate: Date;
}