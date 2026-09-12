const Complaint =
  require("../models/Complaint");

exports.createComplaint =
  async (req, res) => {
    try {
      const {
        busId,
        type,
        message,
      } = req.body;

      const complaint =
        await Complaint.create({
          studentUID: req.user.uid,
          busId,
          type,
          message,
        });

      res.status(201).json(
        complaint
      );
    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }
  };

exports.getAllComplaints =
  async (req, res) => {
    const complaints =
      await Complaint.find()
        .sort({
          createdAt: -1,
        });

    res.json(complaints);
  };

exports.updateComplaintStatus =
  async (req, res) => {
    const complaint =
      await Complaint.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
        }
      );

    res.json(complaint);
  };