using System;
using System.Collections.Generic;
using System.Text;

namespace JobHunter.Domain
{
    public class BaseEntity
    {
        private DateTimeOffset _createdAt = DateTimeOffset.UtcNow;
        private DateTimeOffset _updatedAt = DateTimeOffset.UtcNow;

        public DateTimeOffset CreatedAt
        {
            get => _createdAt;
            set => _createdAt = value.ToUniversalTime();
        }

        public DateTimeOffset UpdatedAt
        {
            get => _createdAt;
            set => _createdAt = value.ToUniversalTime();
        }


        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get;  set;}


    }
}
