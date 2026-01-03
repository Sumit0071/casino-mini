import { Request, Response } from "express";
import bcryptjs from "bcryptjs";

import {prisma} from "../lib/prisma";
import jwt from "jsonwebtoken";


// register user function
export const registerUser = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { username, password, email } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique( {
            where: { email },
        } );

        if ( existingUser ) {
            res.status( 409 ).json( {
                message: "User with this email already exists",
                success: false,
            } );
            return;
        }

        // Hash the password
        const saltRounds = process.env.SALT ? parseInt( process.env.SALT ) : 10;
        const hashedPassword = await bcryptjs.hash( password, saltRounds );

        // Create the new user
        const newUser = await prisma.user.create( {
            data: {
                username,
                email,
                password: hashedPassword,
            },
        } );

        // Generate JWT token
        const token = jwt.sign( { id: newUser.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' } );

        res.cookie( 'token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production
            maxAge: 3600000, // 1 hour
            sameSite: 'strict', // Helps prevent CSRF attacks           
        } )
        res.status( 201 ).json( {
            message: "User registered successfully",
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            }
        } );
    } catch ( error ) {
        console.error( "Error in registerUser:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};

// login user function
export const loginUser = async ( req: Request, res: Response ): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await prisma.user.findUnique( {
            where: { email },
        } );
        if ( !user ) {
            res.status( 401 ).json( {
                message: "Invalid credentials",
                success: false,
            } );
            return;
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcryptjs.compare( password, user.password );

        if ( !isPasswordValid ) {
            res.status( 401 ).json( {
                message: "Invalid credentials",
                success: false,
            } );
            return;
        }

        // Generate JWT token
        const token = jwt.sign( { id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' } );

        // Set the token as a secure, HttpOnly cookie
        res.cookie( 'token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            sameSite: 'strict', // Helps protect against CSRF attacks
            maxAge: 3600000, // 1 hour expiration in milliseconds
        } );
        res.status( 200 ).json( {
            message: "User logged in successfully",
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        } );
    } catch ( error ) {
        console.error( "Error in loginUser:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};

// get user profile function
export const getUserProfile = async ( req: Request, res: Response ): Promise<void> => {
    try {
        // req.id is set by the authMiddleware
        const userId = ( req as any ).id;

        const user = await prisma.user.findUnique( {
            where: { id: parseInt( userId ) },
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            },
        } );

        if ( !user ) {
            res.status( 404 ).json( {
                message: "User not found",
                success: false,
            } );
            return;
        }

        res.status( 200 ).json( {
            message: "User profile fetched successfully",
            success: true,
            user,
        } );
    } catch ( error ) {
        console.error( "Error in getUserProfile:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};


export const logoutUser = async ( req: Request, res: Response ): Promise<void> => {
    try {
        res.cookie( "token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            expires: new Date( 0 ), // Expire immediately
        } );

        res.status( 200 ).json( {
            message: "User logged out successfully",
            success: true,
        } );
    } catch ( error ) {
        console.error( "Error in logoutUser:", error );
        res.status( 500 ).json( {
            message: "Internal server error",
            success: false,
        } );
    }
};  