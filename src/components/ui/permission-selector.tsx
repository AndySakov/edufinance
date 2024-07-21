import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminPermissions } from "@/shared/constants";
import { convertToTitleCase } from "@/shared/helpers";

export interface PermissionsSelectorProps {
  selectedPermissions: string[];
  setSelectedPermissions: (permissions: string[]) => void;
}

export function PermissionSelector({
  selectedPermissions,
  setSelectedPermissions,
}: PermissionsSelectorProps) {
  const handlePermissionChange = (permission: string) => {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(
        selectedPermissions.filter((f) => f !== permission)
      );
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  };

  const permissions = Object.values(AdminPermissions).slice(1);

  return (
    <div className="gap-6 grid">
      <div>
        <Label className="font-semibold">Select Permissions</Label>
        <p className="text-muted-foreground text-sm">
          Choose the permissions you want to give to the user.
        </p>
      </div>
      <div className="gap-4 grid grid-cols-3">
        {permissions.map((permission, index) => (
          <div className="flex items-center gap-2" key={index}>
            <Checkbox
              name={permission}
              id={permission}
              checked={selectedPermissions.includes(permission)}
              onCheckedChange={() => handlePermissionChange(permission)}
            />
            <Label htmlFor={permission} className="font-normal text-sm">
              {convertToTitleCase(permission)}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
