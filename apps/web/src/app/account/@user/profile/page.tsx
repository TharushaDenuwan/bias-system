"use client";

import {
  changeUserEmail,
  deleteUser,
  updateUserDetails,
} from "@/features/profile/actions/get-user-detail";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@repo/ui/components/avatar";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  AlertTriangle,
  Camera,
  Loader2,
  Mail,
  Save,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    email: "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateUserDetails({
        name: formData.name,
        image: formData.image,
        email: formData.email,
      });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingEmail(true);

    try {
      await changeUserEmail({ email: formData.email });
      toast.success("Email change request sent! Please check your inbox.");
    } catch (error) {
      toast.error("Failed to send email change request. Please try again.");
    } finally {
      setIsChangingEmail(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert to base64 for preview (you might want to upload to a service like Cloudinary)
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirmation) {
      setShowDeleteConfirmation(true);
      return;
    }

    setIsDeleting(true);

    try {
      await deleteUser();
      toast.success("Account deleted successfully!");
      // Redirect to homepage or login page after deletion
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Profile Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>

        {/* Profile Picture Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Camera className="w-5 h-5 text-primary" />
              Profile Picture
            </CardTitle>
            <CardDescription>
              Upload a new avatar to personalize your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-primary/20">
                  <AvatarImage src={formData.image} />
                  <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary/20 to-primary/10">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              <div className="space-y-3 flex-1">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="image" className="text-sm font-medium">
                      Profile Picture
                    </Label>
                    <div className="mt-2 flex gap-3">
                      <div className="relative">
                        <input
                          type="file"
                          id="imageUpload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document.getElementById("imageUpload")?.click()
                          }
                          disabled={isUploadingImage}
                          className="flex items-center gap-2"
                        >
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              Upload Image
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="flex-1">
                        <Input
                          id="image"
                          type="url"
                          placeholder="Or paste image URL"
                          value={formData.image}
                          onChange={(e) =>
                            handleInputChange("image", e.target.value)
                          }
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Upload an image from your device or paste a URL. Maximum
                    file size: 5MB.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <User className="w-5 h-5 text-primary" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information and display name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Display Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your display name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-xs text-muted-foreground">
                  This is the name that will be displayed to other users.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isUpdating || !formData.name}
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Mail className="w-5 h-5 text-primary" />
              Email Settings
            </CardTitle>
            <CardDescription>
              Change your email address. You'll need to verify the new email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangeEmail} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your new email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Verification Required
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    A verification link will be sent to your new email address.
                  </p>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isChangingEmail || !formData.email}
                variant="outline"
                className="w-full sm:w-auto border-primary/20 hover:bg-primary/5 transition-all duration-200"
              >
                {isChangingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Change Email
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone - Delete Account */}
        <Card className="border-0 shadow-lg border-red-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl text-red-600">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-red-900">
                    Warning: This action cannot be undone
                  </h4>
                  <p className="text-sm text-red-700">
                    Deleting your account will permanently remove all your data,
                    including:
                  </p>
                  <ul className="text-sm text-red-700 list-disc list-inside space-y-1 ml-4">
                    <li>Profile information and settings</li>
                    <li>Booking history and reservations</li>
                    <li>Reviews and ratings</li>
                    <li>Saved properties and preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            {!showDeleteConfirmation ? (
              <Button
                onClick={handleDeleteAccount}
                variant="destructive"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-red-900 mb-2">
                    Are you absolutely sure you want to delete your account?
                  </p>
                  <p className="text-sm text-red-700">
                    Type "DELETE" below to confirm this action:
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Yes, Delete My Account
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowDeleteConfirmation(false)}
                    variant="outline"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-blue-900">
                Security Notice
              </h4>
              <p className="text-sm text-blue-700">
                For your security, any changes to your email address will
                require verification. You'll receive a confirmation link at your
                new email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
