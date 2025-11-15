import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  fetchUserProfile,
  updateUserProfile,
  uploadAvatar,
} from "../../api/profile";
import { getUserAddresses } from "../../api/addresses";
import { useDispatch, useSelector } from "react-redux";
import { refreshUserProfile } from "../../store/actions";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    userName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, addressRes] = await Promise.all([
          fetchUserProfile(),
          getUserAddresses(),
        ]);
        setProfile(profileRes);
        setAddresses(addressRes);
        setFormState({
          userName: profileRes.userName || "",
          email: profileRes.email || "",
          phone: profileRes.phone || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile information");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUserProfile(formState);
      setProfile(updated);
      dispatch(refreshUserProfile());
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const { avatarUrl } = await uploadAvatar(file);
      setProfile((prev) => ({ ...prev, avatarUrl }));
      dispatch(refreshUserProfile());
      toast.success("Avatar updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Avatar upload failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Personal Information
        </h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex flex-col items-center sm:items-start gap-3">
            <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-3xl text-slate-400">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                (profile?.userName?.[0] || "U").toUpperCase()
              )}
            </div>
            <label className="text-sm font-medium text-blue-600 cursor-pointer">
              Change avatar
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </label>
          </div>
          <form className="flex-1 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full name
              </label>
              <input
                name="userName"
                value={formState.userName}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone number
              </label>
              <input
                name="phone"
                value={formState.phone}
                onChange={handleChange}
                className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">
          Shipping addresses
        </h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-slate-500">
            You don't have any saved addresses yet. Add one during checkout.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.addressId}
                className="border border-slate-200 rounded-xl p-4"
              >
                <p className="font-semibold text-slate-800">
                  {address.buildingName}
                </p>
                <p className="text-sm text-slate-600">{address.street}</p>
                <p className="text-sm text-slate-600">
                  {address.city}, {address.state}
                </p>
                <p className="text-sm text-slate-600">
                  {address.country}, {address.pincode}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;

