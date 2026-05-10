export interface Movimiento {
    id: number;
    cantidad: number;
    descripcion: string;
    tipo: string;
    user_id: number;
    historial: any[];
    created_at: Date;
    update_at: Date;
    deleted_at: Date;
    user: {
        id: number;
        name: string;
        email: string;
    };
}
