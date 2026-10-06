import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "invalid type",
            })
        }

        if (!email.trim() || !password.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            })
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            })
        }

        const admin = await prisma.admin.findUnique({
            where: {
                email: email,
            },
        });

        if (!admin || !admin.password) {
            return res.status(404).json({
                success: false,
                message: "Email or password invalid",
            });
        }

        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.status(404).json({
                success: false,
                message: "Email or password invalid",
            });
        }

        await prisma.admin.update({
            where: {
                id: admin.id
            },
            data:{
                isNeedLogout:false
            }
        })

        const accessToken = generateAccessToken(admin.id, admin.firstName,admin.email);
        
        const refreshToken = generateRefreshToken(admin.id);

        res.cookie('refreshtoken', refreshToken,{
            httpOnly:true,
            secure: true,
            sameSite: 'strict',
            maxAge: 7*24*60*1000,
    })

        

        return res.status(200).json({
            success: true,
            message: "Login success",
            accessToken:accessToken,
            data: {
                id: admin.id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error!",
        });
    }
};

const Logout = async (res) => {
    res.clearCookie('refreshtoken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            })

    return res.status(200).json({
        success: true,
        message: "Logout successfully",
    });
}

export const verifyRefreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshtoken;
        if (!token) {

            Logout(res)
            return res.status(401).json({
                success: false,
                message: "Unauthorized 1",
            });
        }

        const decode = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

        const id = decode.id;

        if (!id) {
            Logout(res)
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const admin = await prisma.admin.findUnique({
            where: {
                id: id,
            },
        });

        if (!admin) {
            Logout(res)
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            })
        }



        const accessToken = generateAccessToken(admin.id, admin.firstname, admin.email);

        return res.status(200).json({
            success: true,
            accessToken: accessToken,
        });

        const adminOBJ = {
            id:admin.id,
            firstName:admin.firstName,
            lastName:admin.lastName,
            email:admin.email
        }

        return res.status(200).json({
            success: true,
            accessToken: accessToken,
            admin: adminOBJ
        });

        
    } catch (error) {
        Logout(res)
    }
}


