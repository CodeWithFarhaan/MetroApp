const userLogout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export default userLogout;
