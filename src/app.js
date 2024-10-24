const exprss = require("express");
const connectDB = require("./config/database");
const cookieParser = require('cookie-parser');
const authRouter = require('./routers/auth');
const profileRouter = require('./routers/profile');
const requestRouter = require('./routers/request');
const userRouter = require('./routers/user');
const cors = require('cors');
const app = exprss();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(exprss.json());
app.use(cookieParser());

app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/request', requestRouter);
app.use('/user', userRouter);

connectDB().then(() => {
    console.log("DB connected");
    app.listen('3000', () => console.log("Server started at port 3000"))

}).catch((err) => {
    console.log(err);
})
