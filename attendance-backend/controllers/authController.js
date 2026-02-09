exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      role: user.role,   // 🔥 VERY IMPORTANT
    },
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, enrollmentNo } = req.body;
    console.log("REQ BODY:", req.body);

    console.log("REGISTER ROLE RECEIVED:", role); // 🔥 DEBUG

    if (!role) {
      return res.status(400).json({ message: "Role required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role, // 🔥🔥🔥 THIS WAS MISSING
      enrollmentNo: role === "student" ? enrollmentNo : undefined,
    });

    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

