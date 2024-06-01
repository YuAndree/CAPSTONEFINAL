package cit.ojtnsync.caps.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cit.ojtnsync.caps.Entity.AdminEntity;
import cit.ojtnsync.caps.Repository.AdminRepository;
@Service
public class AdminService {
	
	@Autowired
	private AdminRepository adminRepository;
	
	 public boolean existsById(long id) {
	        return adminRepository.existsById(id);
	    }
	 public void createAdmin(AdminEntity adminEntity) {
	        adminRepository.save(adminEntity);
	    }
	 public List<AdminEntity> getAllAdmins() {
	        return adminRepository.findAll();
	    }
	 public AdminEntity findById(long id) {
	        if (adminRepository.findById(id) != null)
	            return adminRepository.findById(id);
	        else
	            return null;
	    }

	public AdminEntity findByFacultyId(String id) {
		return adminRepository.findByFacultyId(id);
	}
}
