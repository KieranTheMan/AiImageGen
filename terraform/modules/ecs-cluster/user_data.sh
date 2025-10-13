#!/bin/bash

# Log output for debugging
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "Starting ECS instance configuration..."

# Configure ECS agent to register with the cluster
echo "ECS_CLUSTER=${cluster_name}" >> /etc/ecs/ecs.config

# Enable IAM roles for tasks
echo "ECS_ENABLE_TASK_IAM_ROLE=true" >> /etc/ecs/ecs.config
echo "ECS_ENABLE_TASK_IAM_ROLE_NETWORK_HOST=true" >> /etc/ecs/ecs.config

# Enable container metadata
echo "ECS_ENABLE_CONTAINER_METADATA=true" >> /etc/ecs/ecs.config

# Set available logging drivers
echo "ECS_AVAILABLE_LOGGING_DRIVERS=[\"json-file\",\"awslogs\"]" >> /etc/ecs/ecs.config

# Enable spot instance draining (if using spot instances)
echo "ECS_ENABLE_SPOT_INSTANCE_DRAINING=true" >> /etc/ecs/ecs.config

# Start and enable the ECS agent
systemctl enable --now ecs

echo "ECS instance configuration complete!"