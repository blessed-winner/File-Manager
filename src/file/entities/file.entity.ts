import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class File{
    @PrimaryGeneratedColumn('uuid')
    id: String

    @Column()
    publicId:string

    @Column()
    url:String

    @Column()
    originalName:string

    @Column()
    resourceType:String

    @Column()
    mimeType:string

    @Column('int')
    size:number

    @CreateDateColumn()
    createdAt:Date

    @CreateDateColumn()
    updatedAt:Date

    //TO DO: Integrating with the soon to be created user entity
    //@Column({ nullable:true })
    //uploadedBy:string
}