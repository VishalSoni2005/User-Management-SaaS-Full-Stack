export default function UserProfilePage({}) {
  // Sample user data - replace with your actual data
  const user = {
    firstName: "John",
    lastName: "Doe",
    role: "Product Designer",
    email: "john.doe@example.com",
    joinedDate: "January 15, 2024",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Profile Card */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-zinc-800 to-zinc-900"></div>

          {/* Profile Content */}
          <div className="px-6 pb-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-16 mb-4">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-zinc-900 bg-zinc-800"
              />
            </div>

            {/* User Info */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-sm font-medium text-zinc-400 mb-4">
                {user.role}
              </p>
            </div>

            {/* Info Grid */}
            <div className="space-y-4">
              {/* Email */}
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-sm text-white break-all">{user.email}</p>
              </div>

              {/* Joined Date */}
              <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1">
                  Joined Us
                </p>
                <p className="text-sm text-white">{user.joinedDate}</p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full mt-6 bg-white text-black font-semibold py-2 px-4 rounded-lg hover:bg-zinc-100 transition-colors duration-200">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
