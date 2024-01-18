export interface TableDefinition {
    column: string;
    displayName: string;
    type: TableTypes;
  }
  
  export enum TableTypes {
    action = 0,
    text = 1,
    dateTime = 2
  }