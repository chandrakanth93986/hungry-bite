import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import ownerModel from '@/models/Owner';
import jwt from 'jsonwebtoken';


export async function POST(req) {
    await dbConnect();
    const { email, password } = await req.json();
    const owner = await ownerModel.findOne({ email });
    if (!owner) {
        return Response.json(
            {
                success: false,
                message: 'Email is not registered!',
            },
            { status: 400 }
        );
    }
    const isPasswordCorrect = await bcrypt.compare(password, owner.password);
    if (!isPasswordCorrect) {
        return Response.json(
            {
                success: false,
                message: 'Incorrect password!',
            },
            { status: 400 }
        );
    }

    const token = jwt.sign({email}, process?.env?.SECRET_KEY, { expiresIn: '1h' });

    return Response.json({ success: true, token: token }, { status: 200 });
}