import { OrderStatus } from "@vm-kvitki/common-lib";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
    id: string,
    status: OrderStatus,
    version: number,
    userId: string,
    price: number
}

interface FindByIdAndVersionAttrs {
    id: string;
    version: number;
}

interface OrderDoc extends mongoose.Document{
    status: OrderStatus,
    version: number,
    userId: string,
    price: number
}

interface OrderModel extends mongoose.Model<OrderDoc>{
    build(attrs: OrderAttrs): OrderDoc;
    findByIdAndVersion(event: FindByIdAndVersionAttrs): Promise<OrderDoc | null>;
}

const orderSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created
    },
    userId: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    toJSON:{
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version'); //not to use __v
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        userId: attrs.userId,
        status: attrs.status,
    });
};

orderSchema.statics.findByIdAndVersion = (event: FindByIdAndVersionAttrs) => {
    return Order.findOne({
        _id: event.id,
        version: event.version,
})
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };