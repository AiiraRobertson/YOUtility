const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const express = require('express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'YOUtility Marketplace API',
            version: '1.0.0',
            description: 'Complete backend API documentation for YOUtility marketplace platform',
            contact: {
                name: 'YOUtility Team',
                email: 'support@youtil.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server'
            },
            {
                url: 'https://api.youtil.com',
                description: 'Production server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT Authorization header using the Bearer scheme'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        firstName: { type: 'string' },
                        lastName: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        phone: { type: 'string' },
                        userType: { type: 'string', enum: ['customer', 'provider'] },
                        address: {
                            type: 'object',
                            properties: {
                                street: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                zipCode: { type: 'string' },
                                country: { type: 'string' }
                            }
                        },
                        rating: {
                            type: 'object',
                            properties: {
                                averageRating: { type: 'number' },
                                totalReviews: { type: 'number' }
                            }
                        },
                        isVerified: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Booking: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        bookingId: { type: 'string' },
                        customer: { type: 'string' },
                        provider: { type: 'string' },
                        service: { type: 'string' },
                        description: { type: 'string' },
                        status: { type: 'string', enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled', 'rejected'] },
                        scheduledDate: { type: 'string', format: 'date' },
                        scheduledTime: { type: 'string' },
                        duration: { type: 'number' },
                        location: { type: 'object' },
                        price: { type: 'object' },
                        progress: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Payment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        transactionId: { type: 'string' },
                        booking: { type: 'string' },
                        customer: { type: 'string' },
                        provider: { type: 'string' },
                        amount: { type: 'number' },
                        status: { type: 'string', enum: ['pending', 'completed', 'failed', 'refunded'] },
                        paymentMethod: { type: 'string', enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'] },
                        breakdown: { type: 'object' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Review: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        booking: { type: 'string' },
                        customer: { type: 'string' },
                        provider: { type: 'string' },
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        comment: { type: 'string' },
                        wouldRecommend: { type: 'boolean' },
                        isPublished: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' }
                    }
                },
                Earnings: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        provider: { type: 'string' },
                        totalEarnings: { type: 'number' },
                        totalJobs: { type: 'number' },
                        availableBalance: { type: 'number' },
                        pendingBalance: { type: 'number' },
                        monthlyEarnings: { type: 'array' },
                        withdrawals: { type: 'array' }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        errors: { type: 'array' }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    console.log('Swagger docs available at http://localhost:5000/api-docs');
};

module.exports = { setupSwagger, specs };
