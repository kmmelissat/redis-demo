import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    price: number
}
