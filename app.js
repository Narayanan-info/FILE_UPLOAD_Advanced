const express = require('express');
const fileRoutes = require('./routes/fileRoutes');

const app = express();

app.use(express.json());

app.use('/api/upload', fileRoutes);

app.use((err, req, res, next) => {
    return res.status(400).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
